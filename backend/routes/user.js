const express = require('express');
const { register, login, verify,resend,forgetPassword,forgetPasswordOtpVerify,forgetPasswordChange } = require('../controllers/UserController');
const TokenModel = require("../models/RefreshTokenModel")
const router = express.Router();
const jwt = require('jsonwebtoken');
// const authCheckMiddleware = (req, res, next) => {
//     const token = req.headers.authorization;

//     if (!token) {
//         return res.status(401).json({ message: 'Authorization token is missing' });
//     }

//     try {
//         const decoded = jwt.verify(token, 'your_secret_key_here');
//         req.user = decoded;
//         next();
//     } catch (error) {
//         return res.status(401).json({ message: 'Invalid token' });
//     }
// };

router.post("/register", register);
router.post("/login", login);
router.post("/resend-otp", resend);
router.post("/forget-password", forgetPassword);
router.post("/forget-password-otp-verify", forgetPasswordOtpVerify);
router.post("/forget-password-change", forgetPasswordChange);
router.post("/verify",verify )
router.post("/check", async (req, res) => {
   res.send("Hai")
});

module.exports = router;
