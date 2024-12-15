const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS
    }
});

const sendActivationMail = async (name, email) => {
    const confirmationLink = `http://localhost:0045/api/confirm-email?email=${email}`;

    const mailOptions = {
        from: process.env.USER_EMAIL,
        to: email,
        subject: "Registration Confirmation",
        text: `Hello ${name},\n\nPlease click the following link to confirm your email:\n${confirmationLink}`,
        html: `
            <html>
                <body style="font-family: Arial, sans-serif; color: #333;">
                    <h4>Dear ${name},</h4>
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
        throw new Error("Failed to send email");
    }
};

module.exports = { sendActivationMail };
