require('dotenv').config();
const express = require('express');
const sequelize = require('./db');
const cors = require('cors');
require('./mongo');
const chatRoutes = require('./routes/chat');
const orderRoutes = require('./routes/orders');
const assistantRoutes = require('./routes/assistant');
const paymentRoutes = require('./routes/payments');
const { authenticate, requireRole } = require('./middleware/auth');
const { getAuth } = require('./config/firebaseAdmin');
const { execute, toOrderStatusEnum, normalizeOrder } = require('./config/dataconnect');

const port = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cors());

// One-off, idempotent cleanups on boot. Orders and payments live in Firebase
// Data Connect, so nothing migrates locally anymore.
sequelize
  .authenticate()
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
    await execute('AdminDeleteUserData', { variables: { uid: req.params.id } });
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
    const data = await execute('AdminListOrders');
    return res.status(200).json({ orders: (data.orders || []).map(normalizeOrder) });
  } catch (err) {
    console.error('List orders error:', err);
    return res.status(500).json({ message: 'Could not load orders.' });
  }
});

// Admin: update an order's status
app.patch('/api/admin/orders/:id', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const statusEnum = toOrderStatusEnum(status);
    if (!statusEnum) {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    await execute('AdminUpdateOrderStatus', {
      variables: { id: req.params.id, status: statusEnum },
    });

    const data = await execute('AdminGetOrder', { variables: { id: req.params.id } });
    const order = normalizeOrder((data.orders || [])[0]);
    if (!order) return res.status(404).json({ message: 'Order not found.' });

    return res.status(200).json({ order });
  } catch (err) {
    console.error('Update order error:', err);
    return res.status(500).json({ message: 'Could not update the order.' });
  }
});

// Admin: dashboard stats
app.get('/api/admin/stats', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const data = await execute('AdminListOrders');
    const orders = (data.orders || []).map(normalizeOrder);

    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
    const inProgressOrders = orders.filter((o) => o.status === 'In progress').length;
    const completedOrders = orders.filter((o) => o.status === 'Completed').length;

    let totalUsers = 0;
    try {
      const result = await getAuth().listUsers(1000);
      totalUsers = result.users.filter((u) => u.customClaims?.role !== 'admin').length;
    } catch (err) {
      console.error('Count users error:', err.message);
    }

    const recentOrders = orders.slice(0, 5);

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const monthly = new Array(12).fill(0);
    orders.forEach((o) => {
      const d = new Date(o.createdAt);
      if (Number.isNaN(d.getTime()) || d < twelveMonthsAgo) return;
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
