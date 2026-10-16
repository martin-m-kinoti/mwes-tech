require('dotenv').config();
const express = require('express');
const { Op } = require('sequelize');
const sequelize = require('./db');
const Order = require('./models/Order');
const cors = require('cors');
require('./mongo');
const chatRoutes = require('./routes/chat');
const orderRoutes = require('./routes/orders');
const assistantRoutes = require('./routes/assistant');
const paymentRoutes = require('./routes/payments');
const { authenticate, requireRole } = require('./middleware/auth');
const { getAuth } = require('./config/firebaseAdmin');

const port = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cors());

// One-off, idempotent migration from the old Sequelize User FK (userId) to the
// Firebase UID columns. Safe to run on every boot.
async function migrateSchema() {
  const qi = sequelize.getQueryInterface();

  async function columnExists(table, column) {
    try {
      const description = await qi.describeTable(table);
      return Boolean(description[column]);
    } catch {
      return false;
    }
  }

  async function addColumnIfMissing(table, column, definition) {
    if (await columnExists(table, column)) return;
    await sequelize.query(`ALTER TABLE "${table}" ADD COLUMN "${column}" ${definition};`);
  }

  async function dropNotNull(table, column) {
    try {
      await sequelize.query(`ALTER TABLE "${table}" ALTER COLUMN "${column}" DROP NOT NULL;`);
    } catch {
      // column may not exist on a fresh database
    }
  }

  // Legacy orders rows keep their old userId (now nullable); new rows use firebaseUid.
  if (await columnExists('orders', 'userId')) {
    await addColumnIfMissing('orders', 'firebaseUid', 'VARCHAR(255)');
    await addColumnIfMissing('orders', 'userEmail', 'VARCHAR(255)');
    await dropNotNull('orders', 'userId');
  }

  // Same for payments.
  if (await columnExists('payments', 'userId')) {
    await addColumnIfMissing('payments', 'firebaseUid', 'VARCHAR(255)');
    await dropNotNull('payments', 'userId');
  }
}

sequelize
  .authenticate()
  .then(() => migrateSchema())
  .then(() => sequelize.sync())
  .then(() => console.log('Connected to the database'))
  .catch((err) => console.error('Database connection error:', err));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    message: 'Successfully connected to the server',
  });
});

app.use('/api/chat', chatRoutes);
app.use('/api/orders', authenticate, orderRoutes);
app.use('/api/assistant', assistantRoutes);
app.use('/api/payments', paymentRoutes);

// Current authenticated user (decoded from the Firebase ID token)
app.get('/api/auth/me', authenticate, (req, res) => {
  return res.status(200).json({
    user: {
      uid: req.user.uid,
      userid: req.user.uid,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      role: req.user.role,
    },
  });
});

// Admin: list users (from Firebase Auth)
app.get('/api/admin/users', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const auth = getAuth();

    const listed = [];
    let pageToken;
    do {
      const result = await auth.listUsers(1000, pageToken);
      listed.push(...result.users);
      pageToken = result.pageToken;
    } while (pageToken);

    const users = listed.map((u) => {
      const [firstName, ...rest] = (u.displayName || '').split(' ').filter(Boolean);
      return {
        uid: u.uid,
        id: u.uid,
        userid: u.uid,
        email: u.email || '',
        firstName,
        lastName: rest.join(' '),
        role: u.customClaims?.role === 'admin' ? 'admin' : 'client',
        createdAt: u.metadata.creationTime,
        updatedAt: u.metadata.lastSignInTime || u.metadata.creationTime,
      };
    });

    return res.status(200).json({ users });
  } catch (err) {
    console.error('List users error:', err);
    return res.status(500).json({ message: 'Could not load users.' });
  }
});

// Admin: delete a user (and their orders)
app.delete('/api/admin/users/:id', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const auth = getAuth();
    await auth.deleteUser(req.params.id);
    await Order.destroy({ where: { firebaseUid: req.params.id } });
    return res.status(200).json({ message: 'User deleted successfully.' });
  } catch (err) {
    console.error('Delete user error:', err);
    if (err.code === 'auth/user-not-found') {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.status(500).json({ message: 'Could not delete user.' });
  }
});

// Admin: list all orders
app.get('/api/admin/orders', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const orders = await Order.findAll({
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json({ orders });
  } catch (err) {
    console.error('List orders error:', err);
    return res.status(500).json({ message: 'Could not load orders.' });
  }
});

// Admin: update an order's status
app.patch('/api/admin/orders/:id', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['Pending', 'In progress', 'Completed'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    order.status = status;
    await order.save();
    return res.status(200).json({ order });
  } catch (err) {
    console.error('Update order error:', err);
    return res.status(500).json({ message: 'Could not update the order.' });
  }
});

// Admin: dashboard stats
app.get('/api/admin/stats', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const [totalOrders, pendingOrders, inProgressOrders, completedOrders] =
      await Promise.all([
        Order.count(),
        Order.count({ where: { status: 'Pending' } }),
        Order.count({ where: { status: 'In progress' } }),
        Order.count({ where: { status: 'Completed' } }),
      ]);

    let totalUsers = 0;
    try {
      const result = await getAuth().listUsers(1000);
      totalUsers = result.users.filter((u) => u.customClaims?.role !== 'admin').length;
    } catch (err) {
      console.error('Count users error:', err.message);
    }

    const recentOrders = await Order.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
    });

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const monthOrders = await Order.findAll({
      attributes: ['createdAt'],
      where: { createdAt: { [Op.gte]: twelveMonthsAgo } },
    });

    const monthly = new Array(12).fill(0);
    monthOrders.forEach((o) => {
      const d = new Date(o.createdAt);
      const idx = (d.getFullYear() - twelveMonthsAgo.getFullYear()) * 12 +
        (d.getMonth() - twelveMonthsAgo.getMonth());
      if (idx >= 0 && idx < 12) monthly[idx] += 1;
    });

    return res.status(200).json({
      stats: {
        totalUsers,
        totalOrders,
        pendingOrders,
        inProgressOrders,
        completedOrders,
        monthlyOrders: monthly,
      },
      recentOrders: recentOrders.map((o) => ({
        id: o.id,
        service: o.service,
        email: o.userEmail || '—',
        requestedAt: o.createdAt,
        status: o.status,
      })),
    });
  } catch (err) {
    console.error('Stats error:', err);
    return res.status(500).json({ message: 'Could not load stats.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
