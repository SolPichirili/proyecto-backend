const twilio = require('twilio');
const logger = require('./winston');

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;

const client = twilio(accountSid, authToken);

const sendWsp = async (messg) => {
    try {
        await client.messages.create(
            {
                body: messg,
                from: 'whatsapp:+14155238886',
                to: 'whatsapp:+541168226456'
            }
        );
    }
    catch (error) {
        logger.error(error);
    }
}

module.exports = {
    sendWsp
}