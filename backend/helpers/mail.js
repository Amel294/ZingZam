const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
    }
});

function generateOtpForUser() {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp;
}

async function sendOtpEmail(otp,user,isResend = false) {
    const subject = isResend ? `Your Resend OTP Code ` : 'Your OTP Code';
    let mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: user,
        subject: subject,
        text: `Your OTP code is: ${ otp } . It will expire in 5 min`
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending OTP email:", error);
        throw error;
    }
}

module.exports = {
    generateOtpForUser,
    sendOtpEmail
};
