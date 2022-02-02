/* eslint-disable no-useless-catch */
const sgMail = require('@sendgrid/mail'); 
require('dotenv').config();

const { SENGRID_API_KEY } = process.env;
sgMail.setApiKey(SENGRID_API_KEY);

// const email = {
//     to: 'xocohel494@mxclip.com',
//     from: 'dorosukolga100@gmail.com',
//     subject: 'тест1',
//     HTML: '<p>привет</p> '
// }

const sendEmail = async (data) => {
    try {
        const email = { ...data, from: 'dorosukolga100@gmail.com' };
        await sgMail.send(email);
        return true;
    } catch (error) {
        throw error;
    }
}


module.exports = sendEmail;

// try {
//     const { page, limit } = req.query;
//     const skip = (page - 1) * limit; 
//     // console.log(req.query);
//     const {_id} = req.user
//     const contacts = await Contact.find({owner: _id}, " -createdAt, -updatedAt ", {skip, limit: +limit});
//   res.json(contacts);
//    }
//   catch (error) {
//     next(error);
    
//   }