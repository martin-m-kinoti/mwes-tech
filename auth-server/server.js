require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');
const sequelize = require('./db');
const User = require('./models/User');
const cors = require('cors');
require('./mongo');
const chatRoutes = require('./routes/chat');

const port = 5000;
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

sequelize
  .authenticate()
  .then(() => sequelize.sync())
  .then(() => console.log('Connected to the database'))
  .catch((err) => console.error('Database connection error:', err)
);

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

app.get('/api/health', (req, res) => {
  res.status(200).json({
    message: 'Successfully connected to the server',
  });
});

app.use('/api/chat', chatRoutes);

// Admin: list users
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await User.findAll({
      order: [['createdAt', 'DESC']],
      attributes: [
        'id',
        'firstName',
        'lastName',
        'email',
        'service',
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
app.delete('/api/admin/users/:id', async (req, res) => {
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
      { sub: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
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
      maxAge: 15 * 60 * 1000, 
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
      user: {
        id: user.id,      
        email: user.email,
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