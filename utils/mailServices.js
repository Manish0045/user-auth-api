const nodemailer = require('nodemailer');
const { CustomError } = require('../middlewares/errorHandler');
const { STATUS_CODES } = require('./constants');

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

const sendActivationMail = async (username, email) => {
    const url = 'http://localhost:3287/api';
    const confirmationLink = `${url}/confirm-email?email=${email}`;

    const mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject: "Registration Confirmation",
        text: `Hii ${username}!,\n\nPlease click the following link to confirm your email:\n${confirmationLink}`,
        html: `
            <html>
                <body style="font-family: Arial, sans-serif; color: #333;">
                    <h4>Dear ${username},</h4>
                    <p>Thank you for registering with us! Please activate your account by clicking the link below:</p>
                    <p><a href="${confirmationLink}" style="color: #042DC3FF; font-size: 16px; font-weight: bold;">Activate My Account</a></p>
                    <h5>To activate your account</h5>
                    <p>If you did not create an account, no action is required.</p>
                    <p><em>If you have any questions, feel free to contact our support team at manishsahani345@gmail.com.</em></p>
                </body>
            </html>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.log('Error: ', error);
        throw new CustomError(STATUS_CODES.FORBIDDEN, "Failed to send email");
    }
};

module.exports = { sendActivationMail };
