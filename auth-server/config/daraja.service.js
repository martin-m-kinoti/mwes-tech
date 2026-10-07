require('dotenv').config();
const axios = require('axios');
const config = require('./daraja.config');

let cachedToken = null;
let tokenExpiresAt = 0;

async function getAccessToken() {
    if (cachedToken && Date.now() < tokenExpiresAt) {
        return cachedToken;
    }

    const auth = Buffer.from(
        `${config.consumerKey}:${config.consumerSecret}`
    ).toString('base64');

    const { data } = await axios.get(
        `${config.baseURL}/oauth/v1/generate?grant_type=client_credentials`,
        { headers: { Authorization: `Basic ${auth}` } }
    );

    cachedToken = data.access_token;
    tokenExpiresAt = Date.now() + (Number(data.expires_in) - 60) * 1000;
    return cachedToken;
}

function timestampNow() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return (
        d.getFullYear().toString() +
        pad(d.getMonth() + 1) +
        pad(d.getDate()) +
        pad(d.getHours()) +
        pad(d.getMinutes()) +
        pad(d.getSeconds())
    );
}

function buildPassword(timestamp) {
    return Buffer.from(`${config.shortcode}${config.passkey}${timestamp}`).toString(
        'base64'
    );
}

function normalizePhone(phone) {
    let p = String(phone).replace(/\s+/g, '').replace(/-/g, '');
    if (p.startsWith('+')) p = p.slice(1);
    if (p.startsWith('0')) p = '254' + p.slice(1);
    if (/^7\d{8}$/.test(p) || /^1\d{8}$/.test(p)) p = '254' + p;
    return p;
}

async function initiateSTKPush({ phone, amount, accountRef, description }) {
    const token = await getAccessToken();
    const timestamp = timestampNow();
    const password = buildPassword(timestamp);
    const msisdn = normalizePhone(phone);

    const payload = {
        BusinessShortCode: config.shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(Number(amount)),
        PartyA: msisdn,
        PartyB: config.shortcode,
        PhoneNumber: msisdn,
        CallBackURL: config.callbackURL,
        AccountReference: String(accountRef).slice(0, 12),
        TransactionDesc: (description || 'mwesTech Payment').slice(0, 13),
    };

    const { data } = await axios.post(
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
        BusinessShortCode: config.shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestID,
    };

    const { data } = await axios.post(
        `${config.baseURL}/mpesa/stkpushquery/v1/query`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
    );

    return data;
}

module.exports = { initiateSTKPush, querySTKStatus, normalizePhone };