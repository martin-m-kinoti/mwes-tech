require('dotenv').config();

const isProd = process.env.DARAJA_ENV === 'production';

module.exports = {
    baseURL: isProd
        ? 'https://api.safaricom.co.ke'
        : 'https://sandbox.safaricom.co.ke',
    consumerKey: process.env.DARAJA_KEY,
    consumerSecret: process.env.DARAJA_SECRET,
    shortcode: process.env.DARAJA_SHORTCODE,
    passkey: process.env.DARAJA_PASSKEY,
    callbackURL: process.env.DARAJA_CALLBACK_URL
};