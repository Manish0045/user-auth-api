const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    port: 465,
    auth: {
        user: process.env.USER_MAIL,
        pass: process.env.USER_PASS
    }
});

const sendMail = async (email) => {

    const confirmationLink = `http://localhost:0045/confirm-email?email=${email}`;

    const mailOptions = {
        from: process.env.USER_MAIL,
        to: email,
        subject: "Email Confirmation",
        text: `Please click the following link to confirm your email: ${confirmationLink}`,
        html: `<p>Please click the following link to confirm your email:</p><a href="${confirmationLink}">${confirmationLink}</a>`
    };

    const sentData = await transporter.sendMail(mailOptions);
    console.log(sentData);
}


module.exports = { sendMail };