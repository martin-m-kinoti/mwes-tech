const express = require('express');
const { authenticate } = require('../middleware/auth');
const { execute, insertedId, normalizeOrder } = require('../config/dataconnect');

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

// Fetches a single order belonging to the current user.
async function fetchMyOrder(id, user) {
  if (!id) return null;
  const data = await execute('GetMyOrder', { variables: { id }, user });
  return normalizeOrder((data.orders || [])[0]) || null;
}

// Create an order (authenticated client)
router.post('/', authenticate, async (req, res) => {
  try {
    const { service, deliveryDuration, comments } = req.body;

    if (!isValidService(service)) {
      return res.status(400).json({ message: 'Please select a valid service.' });
    }
    if (!isValidDuration(deliveryDuration)) {
      return res.status(400).json({ message: 'Please select a valid delivery duration.' });
    }

    const deliveryDate = computeDeliveryDate(deliveryDuration).toISOString();
    const cleanComments = String(comments || '').trim();

    // The Orders row references the User row, so make sure it exists first.
    // Idempotent, so it is safe to call on every order.
    await execute('UpsertCurrentUser', { user: req.user });

    // userEmail is filled in by the schema default (@default(expr:
    // "auth.token.email")) from the impersonated token, so it is not passed
    // as a variable here.
    const created = await execute('CreateOrder', {
      user: req.user,
      variables: {
        service,
        deliveryDuration,
        deliveryDate,
        comments: cleanComments,
      },
    });

    const id = insertedId(created);
    const order = await fetchMyOrder(id, req.user);

    return res.status(201).json({
      order:
        order || {
          id,
          service,
          deliveryDuration,
          deliveryDate,
          comments: cleanComments,
          status: 'Pending',
          userEmail: req.user.email,
        },
    });
  } catch (err) {
    console.error('Create order error:', err);
    return res.status(500).json({ message: 'Could not place the order.' });
  }
});

// List the current user's orders (authenticated)
router.get('/', authenticate, async (req, res) => {
  try {
    const data = await execute('ListMyOrders', { user: req.user });
    return res.status(200).json({ orders: (data.orders || []).map(normalizeOrder) });
  } catch (err) {
    console.error('List orders error:', err);
    return res.status(500).json({ message: 'Could not load your services.' });
  }
});

module.exports = router;
