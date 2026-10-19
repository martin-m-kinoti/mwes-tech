require('dotenv').config();
const axios = require('axios');
const config = require('./daraja.config');

const http = axios.create({ timeout: 30000 });

let cachedToken = null;
let tokenExpiresAt = 0;

// Fail early with a clear message instead of a vague Daraja error
function assertConfig() {
    const required = ['consumerKey', 'consumerSecret', 'shortcode', 'passkey', 'callbackURL', 'baseURL'];
    const missing = required.filter((k) => !String(config[k] || '').trim());
    if (missing.length) {
        throw new Error(`Missing Daraja config: ${missing.join(', ')}`);
    }
}

function cleanText(value, max, fallback) {
    const s = String(value || fallback)
        .replace(/[^a-zA-Z0-9 ]/g, '') // drop &, -, _, punctuation, etc.
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, max)
        .trim(); // trim again after slicing
    return s || fallback;
}

async function getAccessToken() {
    if (cachedToken && Date.now() < tokenExpiresAt) {
        return cachedToken;
    }

    assertConfig();

    const auth = Buffer.from(
        `${config.consumerKey.trim()}:${config.consumerSecret.trim()}`
    ).toString('base64');

    const { data } = await http.get(
        `${config.baseURL}/oauth/v1/generate?grant_type=client_credentials`,
        { headers: { Authorization: `Basic ${auth}` } }
    );

    cachedToken = data.access_token;
    tokenExpiresAt = Date.now() + (Number(data.expires_in) - 60) * 1000;
    return cachedToken;
}

// YYYYMMDDHHmmss in East Africa Time (UTC+3), regardless of server timezone
function timestampNow() {
    const eat = new Date(Date.now() + 3 * 60 * 60 * 1000);
    return eat.toISOString().replace(/\D/g, '').slice(0, 14);
}

function buildPassword(timestamp) {
    return Buffer.from(
        `${String(config.shortcode).trim()}${String(config.passkey).trim()}${timestamp}`
    ).toString('base64');
}

function normalizePhone(phone) {
    let p = String(phone).replace(/[\s-]/g, '');
    if (p.startsWith('+')) p = p.slice(1);
    if (p.startsWith('0')) p = '254' + p.slice(1);
    if (/^[71]\d{8}$/.test(p)) p = '254' + p;

    if (!/^254[71]\d{8}$/.test(p)) {
        throw new Error('Invalid phone number. Use format 07XXXXXXXX or 2547XXXXXXXX');
    }
    return p;
}

async function initiateSTKPush({ phone, amount, accountRef, description }) {
    const amt = Math.round(Number(amount));
    if (!Number.isFinite(amt) || amt < 1) {
        throw new Error('Amount must be a whole number of at least 1');
    }

    const token = await getAccessToken();
    const timestamp = timestampNow();
    const password = buildPassword(timestamp);
    const msisdn = normalizePhone(phone);
    const shortcode = String(config.shortcode).trim();

    const payload = {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline', // use 'CustomerBuyGoodsOnline' for a Till
        Amount: amt,
        PartyA: msisdn,
        PartyB: shortcode,
        PhoneNumber: msisdn,
        CallBackURL: String(config.callbackURL).trim(),
        AccountReference: cleanText(accountRef, 12, 'Payment'),
        TransactionDesc: cleanText(description, 13, 'Payment'),
    };

    if (process.env.NODE_ENV !== 'production') {
        console.log('STK payload:', { ...payload, Password: '***' });
    }

    const { data } = await http.post(
        `${config.baseURL}/mpesa/stkpush/v1/processrequest`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
    );

    return data;
}

async function querySTKStatus(checkoutRequestID) {
    const token = await getAccessToken();
    const timestamp = timestampNow();
    const password = buildPassword(timestamp);

    const payload = {
        BusinessShortCode: String(config.shortcode).trim(),
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestID,
    };

    const { data } = await http.post(
        `${config.baseURL}/mpesa/stkpushquery/v1/query`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
    );

    return data;
}

module.exports = { initiateSTKPush, querySTKStatus, normalizePhone };