require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { Op } = require('sequelize');
const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');
const sequelize = require('./db');
const User = require('./models/User');
const Order = require('./models/Order');
const cors = require('cors');
require('./mongo');
const chatRoutes = require('./routes/chat');
const orderRoutes = require('./routes/orders');
const { authenticate, requireRole } = require('./middleware/auth');

const port = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

Order.belongsTo(User, { foreignKey: 'userId' });

// Login rate limiting
const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { message: 'Too many login attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Email and IP based limiting
    const email = req.body?.email?.trim().toLowerCase() || 'unknown';
    return `${email}:${ipKeyGenerator(req.ip)}`;
  },
});

// Seed the admin account so the admin route is always accessible
const ADMIN_EMAIL = 'admin@mwestech.co.ke';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin123!';

async function seedAdmin() {
  try {
    const existing = await User.findOne({ where: { email: ADMIN_EMAIL } });
    if (!existing) {
      const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
      await User.create({
        firstName: 'mwesTech',
        lastName: 'Admin',
        email: ADMIN_EMAIL,
        service: 'Administration',
        role: 'admin',
        password: hashed,
      });
      console.log('Admin account seeded.');
    } else if (existing.role !== 'admin') {
      existing.role = 'admin';
      await existing.save();
      console.log('Existing admin account promoted to the admin role.');
    }
  } catch (err) {
    console.error('Admin seed error:', err);
  }
}

sequelize
  .authenticate()
  .then(() => sequelize.sync())
  .then(() => seedAdmin())
  .then(() => console.log('Connected to the database'))
  .catch((err) => console.error('Database connection error:', err));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    message: 'Successfully connected to the server',
  });
});

app.use('/api/chat', chatRoutes);
app.use('/api/orders', authenticate, orderRoutes);

// Current authenticated user
app.get('/api/auth/me', authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'firstName', 'lastName', 'email', 'service', 'role'],
    });
    if (!user) return res.status(404).json({ message: 'Account not found.' });
    return res.status(200).json({ user });
  } catch (err) {
    console.error('Me error:', err);
    return res.status(500).json({ message: 'Could not load your account.' });
  }
});

// Admin: list users
app.get('/api/admin/users', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const users = await User.findAll({
      order: [['createdAt', 'DESC']],
      attributes: [
        'id',
        'firstName',
        'lastName',
        'email',
        'service',
        'role',
        'createdAt',
        'updatedAt',
      ],
    });
    return res.status(200).json({ users });
  } catch (err) {
    console.error('List users error:', err);
    return res.status(500).json({ message: 'Could not load users.' });
  }
});

// Admin: delete a user
app.delete('/api/admin/users/:id', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    await user.destroy();
    return res.status(200).json({ message: 'User deleted successfully.' });
  } catch (err) {
    console.error('Delete user error:', err);
    return res.status(500).json({ message: 'Could not delete user.' });
  }
});

// Admin: list all orders
app.get('/api/admin/orders', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const orders = await Order.findAll({
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['email', 'firstName', 'lastName'] }],
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
    const [totalUsers, totalOrders, pendingOrders, inProgressOrders, completedOrders] =
      await Promise.all([
        User.count({ where: { role: 'client' } }),
        Order.count(),
        Order.count({ where: { status: 'Pending' } }),
        Order.count({ where: { status: 'In progress' } }),
        Order.count({ where: { status: 'Completed' } }),
      ]);

    const recentOrders = await Order.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['email'] }],
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
        email: o.User?.email || '—',
        requestedAt: o.createdAt,
        status: o.status,
      })),
    });
  } catch (err) {
    console.error('Stats error:', err);
    return res.status(500).json({ message: 'Could not load stats.' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, service, password } = req.body;

    if (!firstName || !lastName || !email || !service || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }

    // User check
    const userExists = await User.findOne({ where: { email: email.toLowerCase() } });
    if (userExists) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      service,
      role: 'client',
      password: hashedPassword,
    });

    return res.status(201).json({
      message: 'Account created successfully',
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        service: newUser.service,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

// Login endpoint
app.post('/api/auth/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({
      where: {
        email: normalizedEmail,
      }
    });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password.',
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: 'Invalid email or password.',
      });
    }

    const token = jwt.sign(
      { sub: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const refreshToken = jwt.sign(
      { sub: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Login successful
    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        service: user.service,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);

    return res.status(500).json({
      message: 'Login error. Please try again later.',
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});