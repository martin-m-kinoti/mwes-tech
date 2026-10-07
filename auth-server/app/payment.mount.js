const express = require('express');
const router = express.Router();
const paymentRoutes = require('./routes/payments');

router.use('/api/payments', paymentRoutes);
module.exports = router;