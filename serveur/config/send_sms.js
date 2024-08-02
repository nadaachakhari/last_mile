const twilio = require('twilio');
require('dotenv').config();

const accountSid = process.env.ACCOUNT_SID || 'AC0d5d6c84fa8f2a67bf48de9764b0e181';
const authToken = process.env.AUTH_TOKEN || '1652f06d9974f5dbe58335958c2763c6';

if (!accountSid || !authToken) {
    console.error('Twilio credentials are missing!');
    process.exit(1);
}

const client = twilio(accountSid, authToken);

const sendSms = (to, body) => {
    return client.messages.create({
        to: to,
        from: '+18147074063',
        body: body
    });
};

module.exports = sendSms;