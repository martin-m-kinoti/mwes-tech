const express = require('express');
const router = express.Router();
const { querySTKStatus, initiateSTKPush } = require('../config/daraja.service');
const { Payments } = require('../models/Payments');
const { authenticate } = require('../middleware/auth');

router.post("/initiate", authenticate, async (req, res) => {
    try {
        const { phone, amount, serviceId, description } = req.body;

        if (!phone || !amount || !serviceId) {
            return res.status(400).json({ error: 'Phone, amount, and serviceId are required' });
        }

        const result = await initiateSTKPush({
            phone,
            amount,
            accountRef: String(serviceId),
            description: description || 'mwesTech Payment',
        });

        if (result.ResponseCode !== '0') {
            return res.status(502).json({ error: result.ResponseDescription });
        }

        await Payments.create({
            userId: req.user.id,
            checkoutRequestId: result.CheckoutRequestID,
            merchantRequestId: result.MerchantRequestID,
            serviceId,
            phone,
            amount,
            status: 'PENDING',
        });

        res.json({
            message: result.CustomerMessage,
            checkoutRequestId: result.CheckoutRequestID,
        });
    } catch (err) {
        console.error('STK push error:', err.response?.data || err.message);
        res.status(500).json({ error: 'Failed to initiate payment' });
    }
});

router.post('/callback', async (req, res) => {
    const callback = req.body?.Body?.stkCallback;

    if (!callback) {
        return res.status(400).json({ ResultCode: 1, ResultDesc: 'Invalid payload' });
    }

    const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = callback;

    try {
        const record = await Payments.findOne({
            where: { checkoutRequestId: CheckoutRequestID },
        });

        if (!record) {
            console.warn(`No payment row found for ${CheckoutRequestID}`);
            return res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
        }

        if (ResultCode === 0) {
            const items = {};
            (CallbackMetadata?.Item || []).forEach((i) => {
                items[i.Name] = i.Value;
            });

            await record.update({
                status: 'SUCCESS',
                mpesaReceipt: items.MpesaReceiptNumber,
                amountPaid: items.Amount,
                transactionDate: String(items.TransactionDate),
                payerPhone: String(items.PhoneNumber),
            });

            console.log(`Payment SUCCESS for ${CheckoutRequestID}:`, items);
        } else {
            await record.update({ status: 'FAILED', failReason: ResultDesc });
            console.log(`Payment FAILED for ${CheckoutRequestID}: ${ResultDesc}`);
        }

        res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
    } catch (err) {
        console.error('Callback handling error:', err.message);
        res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
    }
});

router.get('/status/:checkoutRequestId', authenticate, async (req, res) => {
    const record = await Payments.findOne({
        where: { checkoutRequestId: req.params.checkoutRequestId },
    });

    if (!record) {
        return res.status(404).json({ error: 'Unknown checkoutRequestId' });
    }

    if (record.status === 'PENDING') {
        try {
            const queryResult = await querySTKStatus(req.params.checkoutRequestId);
            if (queryResult.ResultCode === '0') {
                await record.update({ status: 'SUCCESS' });
            } else if (queryResult.ResultCode && queryResult.ResultCode !== '1032') {
                await record.update({
                    status: 'FAILED',
                    failReason: queryResult.ResultDesc,
                });
            }
        } catch (_) {
            // don't fail the poll on this
        }
    }

    res.json(record);
});

// User: list my payments
router.get('/mine', authenticate, async (req, res) => {
    const records = await Payments.findAll({
        where: { userId: req.user.id },
        order: [['createdAt', 'DESC']],
    });
    res.json(records);
});

// Admin: list all payments
router.get('/', authenticate, async (req, res, next) => {
    try {
        const { requireRole } = require('../middleware/auth');
        return requireRole('admin')(req, res, next);
    } catch (e) {
        return next(e);
    }
}, async (req, res) => {
    const records = await Payments.findAll({
        order: [['createdAt', 'DESC']],
    });
    res.json(records);
});

module.exports = router;