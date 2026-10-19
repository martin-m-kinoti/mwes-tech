const express = require('express');
const router = express.Router();
const { querySTKStatus, initiateSTKPush } = require('../config/daraja.service');
const { Payments } = require('../models/Payments');
const { PaymentEvent } = require('../models/PaymentEvents');
const { authenticate } = require('../middleware/auth');

// Known Daraja STK result codes -> user-facing timeline events.
const KNOWN_RESULTS = {
  1032: { code: 'cancelled', message: 'You cancelled the payment request. No money was deducted.' },
  1037: { code: 'timeout', message: 'The request timed out before you entered your PIN. No money was deducted.' },
  1: { code: 'failed', message: 'Payment failed — insufficient funds in the M-Pesa wallet. No money was deducted.' },
};

function maskPhone(phone) {
  const p = String(phone || '').replace(/\D/g, '');
  if (p.length < 9) return 'your phone';
  return `+254 ${p.slice(-9, -6)}•• ••• ${p.slice(-3)}`;
}

async function logEvent(paymentId, eventCode, message) {
  try {
    await PaymentEvent.create({ paymentId, eventCode, message });
  } catch (err) {
    console.error('Payment event log error:', err.message);
  }
}

async function getEvents(paymentId) {
  const rows = await PaymentEvent.findAll({
    where: { paymentId },
    order: [['createdAt', 'ASC']],
  });
  return rows.map((r) => ({
    eventCode: r.eventCode,
    message: r.message,
    createdAt: r.createdAt,
  }));
}

// Maps a Daraja result code to a timeline event. Dotted codes (e.g.
// "500.001.1001") are API/processing states, so callers treat them as "still
// pending" rather than final outcomes.
function outcomeEvent(resultCode, resultDesc, extra = {}) {
  const known = KNOWN_RESULTS[Number(resultCode)];
  if (known) return known;
  if (Number(resultCode) === 0) {
    const receipt = extra.receipt ? ` — Receipt: ${extra.receipt}` : '';
    return {
      code: 'success',
      message: `Payment of KES ${extra.amount ?? ''} confirmed${receipt}.`,
    };
  }
  return {
    code: 'failed',
    message: `Payment failed${resultDesc ? ` — ${resultDesc}` : ''}. No money was deducted.`,
  };
}

const isIntegerCode = (rc) => /^\d+$/.test(String(rc));

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

        const record = await Payments.create({
            firebaseUid: req.user.uid,
            checkoutRequestId: result.CheckoutRequestID,
            merchantRequestId: result.MerchantRequestID,
            serviceId,
            phone,
            amount,
            status: 'PENDING',
        });

        await logEvent(record.id, 'initiated', 'Payment request sent to Safaricom.');
        await logEvent(
            record.id,
            'prompt_sent',
            `M-Pesa prompt sent to ${maskPhone(phone)} — enter your PIN to complete the payment.`
        );

        res.json({
            message: result.CustomerMessage,
            checkoutRequestId: result.CheckoutRequestID,
            events: await getEvents(record.id),
            final: false,
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

        // Only transition from PENDING: a late callback must not overwrite a
        // result already confirmed by the status poller (or log twice).
        if (record.status === 'PENDING') {
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

                const ev = outcomeEvent(0, null, {
                    receipt: items.MpesaReceiptNumber,
                    amount: items.Amount,
                });
                await logEvent(record.id, ev.code, ev.message);

                console.log(`Payment SUCCESS for ${CheckoutRequestID}:`, items);
            } else {
                await record.update({ status: 'FAILED', failReason: ResultDesc });
                const ev = outcomeEvent(ResultCode, ResultDesc);
                await logEvent(record.id, ev.code, ev.message);
                console.log(`Payment FAILED for ${CheckoutRequestID}: ${ResultDesc}`);
            }
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
                await logEvent(record.id, 'success', 'Payment confirmed. Thank you!');
            } else if (isIntegerCode(queryResult.ResultCode)) {
                await record.update({
                    status: 'FAILED',
                    failReason: queryResult.ResultDesc || 'Payment not completed',
                });
                const ev = outcomeEvent(queryResult.ResultCode, queryResult.ResultDesc);
                await logEvent(record.id, ev.code, ev.message);
            }
        } catch (_) {
            // don't fail the poll on this
        }
    }

    res.json({
        ...record.toJSON(),
        events: await getEvents(record.id),
        final: record.status !== 'PENDING',
    });
});

// User: list my payments
router.get('/mine', authenticate, async (req, res) => {
    const records = await Payments.findAll({
        where: { firebaseUid: req.user.uid },
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