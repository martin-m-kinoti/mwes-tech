const express = require('express');
const router = express.Router();
const { querySTKStatus, initiateSTKPush } = require('../config/daraja.service');
const { execute, insertedId } = require('../config/dataconnect');
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

// Daraja's STK query reports non-terminal states (e.g. "The transaction is
// still under processing" right after the user enters their PIN) as failures.
// Those must stay PENDING and let the callback or a later poll decide.
const NON_TERMINAL_PATTERN = /still under processing|being processed|not found|does not exist/i;

const isNonTerminalDesc = (desc) => NON_TERMINAL_PATTERN.test(String(desc || ''));

// Applies a SUCCESS callback: claims the record while still PENDING, or
// corrects a record that an early status poll wrongly marked FAILED. Returns
// true when this call performed the transition (false for duplicates).
async function finalizeSuccess(key, items) {
  const variables = {
    key,
    receipt: items.MpesaReceiptNumber ?? null,
    amountPaid: items.Amount ?? null,
    transactionDate: items.TransactionDate != null ? String(items.TransactionDate) : null,
    payerPhone: items.PhoneNumber != null ? String(items.PhoneNumber) : null,
  };

  const primary = await execute('AdminFinalizePaymentSuccess', { variables });
  if (finalizeCount(primary) > 0) return true;

  const correction = await execute('AdminCorrectFailedPaymentSuccess', { variables });
  return finalizeCount(correction) > 0;
}

async function logEvent(paymentId, eventCode, message) {
  try {
    await execute('AdminAddPaymentEvent', {
      variables: { paymentId, eventCode, message },
    });
  } catch (err) {
    console.error('Payment event log error:', err.message);
  }
}

async function listEvents(paymentId) {
  const data = await execute('AdminListPaymentEvents', { variables: { paymentId } });
  return data.paymentEvents || [];
}

// AdminFinalizePayment* return the number of rows updated; 0 means another
// path (callback or poller) already finalized the payment.
function finalizeCount(payload) {
  const value = payload ? payload.payment_updateMany : null;
  return typeof value === 'number' ? value : 0;
}

router.post('/initiate', authenticate, async (req, res) => {
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

    // The payment row references the User row, so make sure it exists first.
    // Idempotent, so it is safe to call on every payment.
    await execute('UpsertCurrentUser', { user: req.user });

    const created = await execute('CreateMyPayment', {
      user: req.user,
      variables: {
        checkoutRequestId: result.CheckoutRequestID,
        merchantRequestId: result.MerchantRequestID,
        serviceId: String(serviceId),
        phone: String(phone),
        amount: Number(amount),
      },
    });
    const paymentId = insertedId(created, 'payment_insert');

    await logEvent(paymentId, 'initiated', 'Payment request sent to Safaricom.');
    await logEvent(
      paymentId,
      'prompt_sent',
      `M-Pesa prompt sent to ${maskPhone(phone)} — enter your PIN to complete the payment.`
    );

    return res.json({
      message: result.CustomerMessage,
      checkoutRequestId: result.CheckoutRequestID,
      events: await listEvents(paymentId),
      final: false,
    });
  } catch (err) {
    console.error('STK push error:', err.response?.data || err.message);
    return res.status(500).json({ error: 'Failed to initiate payment' });
  }
});

router.post('/callback', async (req, res) => {
  const callback = req.body?.Body?.stkCallback;

  if (!callback) {
    return res.status(400).json({ ResultCode: 1, ResultDesc: 'Invalid payload' });
  }

  const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = callback;

  try {
    const data = await execute('AdminGetPaymentByKey', {
      variables: { key: CheckoutRequestID },
    });
    const record = (data.payments || [])[0];

    if (!record) {
      console.warn(`No payment row found for ${CheckoutRequestID}`);
      return res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
    }

    if (ResultCode === 0) {
      // Success is authoritative: claim a PENDING record, or correct one that
      // an early status poll wrongly marked FAILED.
      const items = {};
      (CallbackMetadata?.Item || []).forEach((i) => {
        items[i.Name] = i.Value;
      });

      const finalized = await finalizeSuccess(CheckoutRequestID, items);
      if (finalized) {
        const ev = outcomeEvent(0, null, {
          receipt: items.MpesaReceiptNumber,
          amount: items.Amount,
        });
        await logEvent(record.id, ev.code, ev.message);
        console.log(`Payment SUCCESS for ${CheckoutRequestID}:`, items);
      }
    } else if (record.status === 'PENDING') {
      const updated = await execute('AdminFinalizePaymentFailure', {
        variables: { key: CheckoutRequestID, failReason: ResultDesc ?? null },
      });

      if (finalizeCount(updated) > 0) {
        const ev = outcomeEvent(ResultCode, ResultDesc);
        await logEvent(record.id, ev.code, ev.message);
      }

      console.log(`Payment FAILED for ${CheckoutRequestID}: ${ResultDesc}`);
    }

    return res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch (err) {
    console.error('Callback handling error:', err.message);
    return res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  }
});

router.get('/status/:checkoutRequestId', authenticate, async (req, res) => {
  try {
    // Owner-scoped read: the impersonated token filters by auth.uid.
    const fetchMine = () =>
      execute('GetMyPaymentByKey', {
        user: req.user,
        variables: { key: req.params.checkoutRequestId },
      });

    let record = ((await fetchMine()).payments || [])[0];
    if (!record) {
      return res.status(404).json({ error: 'Unknown checkoutRequestId' });
    }

    if (record.status === 'PENDING') {
      try {
        const queryResult = await querySTKStatus(req.params.checkoutRequestId);
        if (queryResult.ResultCode === '0') {
          const updated = await execute('AdminFinalizePaymentSuccess', {
            variables: { key: req.params.checkoutRequestId },
          });
          if (finalizeCount(updated) > 0) {
            await logEvent(record.id, 'success', 'Payment confirmed. Thank you!');
          }
        } else if (
          isIntegerCode(queryResult.ResultCode) &&
          !isNonTerminalDesc(queryResult.ResultDesc)
        ) {
          const failReason = queryResult.ResultDesc || 'Payment not completed';
          const updated = await execute('AdminFinalizePaymentFailure', {
            variables: { key: req.params.checkoutRequestId, failReason },
          });
          if (finalizeCount(updated) > 0) {
            const ev = outcomeEvent(queryResult.ResultCode, queryResult.ResultDesc);
            await logEvent(record.id, ev.code, ev.message);
          }
        }
      } catch (_) {
        // don't fail the poll on this
      }

      record = ((await fetchMine()).payments || [])[0] || record;
    }

    return res.json({
      ...record,
      events: await listEvents(record.id),
      final: record.status !== 'PENDING',
    });
  } catch (err) {
    console.error('Payment status error:', err.message);
    return res.status(500).json({ error: 'Failed to load payment status' });
  }
});

// User: list my payments
router.get('/mine', authenticate, async (req, res) => {
  try {
    const data = await execute('ListMyPayments', { user: req.user });
    return res.json(data.payments || []);
  } catch (err) {
    console.error('List payments error:', err.message);
    return res.status(500).json({ error: 'Failed to load payments' });
  }
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
  try {
    const data = await execute('AdminListPayments');

    // Enrich with the ordered service's name and the client's email so the
    // admin table shows labels instead of raw ids. Best-effort: payments
    // still render if the orders lookup fails.
    let orderMap = new Map();
    try {
      const ordersData = await execute('AdminListOrders');
      orderMap = new Map((ordersData.orders || []).map((o) => [o.id, o]));
    } catch (err) {
      console.error('Admin payments order enrichment error:', err.message);
    }

    const payments = (data.payments || []).map((p) => {
      const order = orderMap.get(p.serviceId);
      return {
        ...p,
        userId: p.user?.id ?? null,
        userEmail: p.user?.email || order?.userEmail || null,
        serviceName: order?.service || null,
      };
    });
    return res.json(payments);
  } catch (err) {
    console.error('Admin list payments error:', err.message);
    return res.status(500).json({ error: 'Failed to load payments' });
  }
});

module.exports = router;
