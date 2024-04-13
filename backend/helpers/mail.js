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

async function sendOtpEmail(otp, user, isResend = false, isReset = false) {
    let subject = isResend ? `Your Resend OTP Code` : `Your OTP Code`;
    let expirationTime = isReset ? 10 : 5; 
    let mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: user,
        subject: isReset ? `Your Forget Password OTP Code` : subject,
        text: `Your OTP code is: ${otp}. It will expire in ${expirationTime} min`
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
