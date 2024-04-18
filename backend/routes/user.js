const express = require('express');
const { register, login, verify,resend,forgetPassword,forgetPasswordOtpVerify,forgetPasswordChange } = require('../controllers/userController');
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/resend-otp", resend);
router.post("/forget-password", forgetPassword);
router.post("/forget-password-otp-verify", forgetPasswordOtpVerify);
router.post("/forget-password-change", forgetPasswordChange);
router.post("/verify",verify )

module.exports = router;
