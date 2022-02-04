/* eslint-disable no-useless-catch */
const sgMail = require('@sendgrid/mail'); 
require('dotenv').config();

const { SENGRID_API_KEY, EMAIL_KEY } = process.env;
sgMail.setApiKey(SENGRID_API_KEY);



const sendEmail = async (data) => {
    try {
        const email = { ...data, from: EMAIL_KEY };
        await sgMail.send(email);
        return true;
    } catch (error) {
        throw error;
    }
}


module.exports = sendEmail;
