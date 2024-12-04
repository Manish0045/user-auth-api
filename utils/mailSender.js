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

const sendActivationMail = async (name, email) => {

    const confirmationLink = `http://localhost:0045/confirm-email?email=${email}`;

    const mailOptions = {
        from: process.env.USER_MAIL,
        to: email,
        subject: "Email Confirmation",
        text: `Please click the following link to confirm your email: ${confirmationLink}`,
        html: `<h4>Dear ${name},</h4><h5>Your profile has been created !</h5><br/><p>Please click the following link to confirm your email:</p><a href="${confirmationLink}">${confirmationLink}</a><h5>To activate your account</h5>`
    };

    const sentData = await transporter.sendMail(mailOptions);
    console.log(sentData);
}


module.exports = { sendActivationMail };