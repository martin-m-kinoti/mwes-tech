const express = require('express');
const Order = require('../models/Order');
const User = require('../models/User');

const router = express.Router();

const DURATIONS_IN_DAYS = {
  '1 Week': 7,
  '2 Weeks': 14,
  '1 Month': 30,
  '2 Months': 60,
};

const SERVICES = [
  'Web Design & Development',
  'Data Analytics',
  'AI & Automations',
  'Cyber Security',
  'IT Consultation',
];

// Add a delivery date relative to now
function computeDeliveryDate(duration) {
  const days = DURATIONS_IN_DAYS[duration] || 14;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

function isValidService(service) {
  return SERVICES.includes(service);
}

function isValidDuration(duration) {
  return Object.prototype.hasOwnProperty.call(DURATIONS_IN_DAYS, duration);
}

// Create an order (authenticated client)
router.post('/', async (req, res) => {
  try {
    const { service, deliveryDuration, comments } = req.body;

    if (!isValidService(service)) {
      return res.status(400).json({ message: 'Please select a valid service.' });
    }
    if (!isValidDuration(deliveryDuration)) {
      return res.status(400).json({ message: 'Please select a valid delivery duration.' });
    }

    const order = await Order.create({
      userId: req.user.id,
      service,
      deliveryDuration,
      deliveryDate: computeDeliveryDate(deliveryDuration),
      comments: String(comments || '').trim(),
      status: 'Pending',
    });

    return res.status(201).json({ order });
  } catch (err) {
    console.error('Create order error:', err);
    return res.status(500).json({ message: 'Could not place the order.' });
  }
});

// List the current user's orders (authenticated)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json({ orders });
  } catch (err) {
    console.error('List orders error:', err);
    return res.status(500).json({ message: 'Could not load your services.' });
  }
});

module.exports = router;