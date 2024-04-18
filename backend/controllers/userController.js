const { validateLength, validatePassword } = require('../helpers/ValidationHelper');
const UserModel = require('../models/UserModel');
const validator = require('validator');
const bcrypt = require("bcrypt");
const TempUserModel = require('../models/TempUserModel');
const ForgetPasswordModel = require('../models/ForgetPasswordModel');
const { generateOtpForUser, sendOtpEmail } = require('../helpers/mail');
const { generateAccessToken, generateRefreshToken, generateTempToken } = require('../helpers/tokens');
const { getDataFromJWTCookie_temporaryToken } = require('../helpers/dataFromJwtCookies');
exports.register = async (req, res) => {
    try {
        let { email, name, gender, password, birthday } = req.body;
        email = email.trim();
        name = name.trim();
        if (!validator.isEmail(email)) {
            return res.status(400).send({
                error: 'Invalid email address'
            });
        }
        const foundUser = await UserModel.findOne({ email });
        if (foundUser) {
            return res.status(200).json({
                error: "User with this email already exist"
            });
        }
        const passwordValid = validatePassword(password)
        if (!passwordValid) {
            return res.status(400).json({
                error: "Password is too Weak"
            });
        }
        if (!validateLength(name, 5, 30)) {
            return res.status(400).json({
                error: "First name must be between 5 and 30 characters"
            });
        }
        let username = name.trim().toLowerCase().replace(/\s/g, '')
        let foundUserName = await UserModel.findOne({ username });
        while (foundUserName) {
            username = `${ name }${ Math.floor(Math.random() * 1000000) }`;
            foundUserName = await UserModel.findOne({ username });
        }
        const cryptedPassword = await bcrypt.hash(password, 12);
        const otp = generateOtpForUser()
        const tempUser = {
            name,
            email,
            password: cryptedPassword,
            username,
            gender,
            birthday,
            otp
        };
        const expiresIn = new Date(Date.now() + 5 * 60 * 1000)
        const tempToken = await generateTempToken({ ...tempUser })
        await TempUserModel.create({
            email: tempUser.email,
            otp,
            expiresIn
        });
        await sendOtpEmail(otp, email)
        const tempTokenMaxAge = 5 * 60 * 1000;
        res.cookie('tempToken', tempToken, {
            // httpOnly: true,
            // secure: true,
            // sameSite: 'strict',
            maxAge: tempTokenMaxAge,
        })
        res.status(200).json({
            message: "OTP send to User",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.verify = async (req, res) => {
    try {
        const jwtToken = req?.cookies?.tempToken;
        const data = getDataFromJWTCookie_temporaryToken(res, jwtToken);
        const { otp } = req.body;
        const otpUser = await TempUserModel.findOne({ email: data.email });
        if (!otpUser) return res.status(400).send({ error: 'Invalid OTP' });
        if (otpUser.otp !== otp) return res.status(400).send({ error: 'Invalid OTP' });
        const newUser = new UserModel({
            name: data.name,
            username: data.username,
            email: data.email,
            password: data.password,
            gender: data.gender,
            birthday: data.birthday,
            verified: true,
        });
        await newUser.save();
        res.status(200).send({ message: 'Token verified successfully', name: newUser.name });
    } catch (error) {
        if (error.message === 'OTP time expired') {
            return res.status(400).send({ error });
        } else {
            res.status(500).send({ error: 'Internal server error' });
        }
    }
};
exports.resend = async (req, res) => {
    try {
        const jwtToken = req?.cookies?.tempToken;
        const data = getDataFromJWTCookie_temporaryToken(res, jwtToken);
        const otp = generateOtpForUser()
        const tempTokenMaxAge = 5 * 60 * 1000;
        const tempToken = await generateTempToken({
            name: data.name,
            email: data.email,
            password: data.password,
            username: data.username,
            gender: data.gender,
            birthday: data.birthday,
            otp
        });
        await TempUserModel.deleteOne({ email: data.email });
        const expiresIn = new Date(Date.now() + 5 * 60 * 1000)
        await TempUserModel.create({
            email: data.email,
            otp,
            expiresIn
        });
        await sendOtpEmail(otp, data.email, isResend = true)
        res.cookie('tempToken', tempToken, {
            // httpOnly: true,
            // secure: true,
            // sameSite: 'strict',
            maxAge: tempTokenMaxAge,
        });
        res.status(200).json({
            message: "Resend OTP send successfully"
        });

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(400).json({ error: "This Email is not Registered. Try again with a valid Email Address." });
        if (user.isBlocked) return res.status(403).json({ error: 'This Account is Blocked. Please contact the Admin', isBlocked: true });
        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) return res.status(400).json({ error: 'Invalid Credentials. Please try again.' });
        const accessToken = generateAccessToken({ id: user._id, username: user.username, name: user.name, role: user.role })
        const accessTokenMaxAge = 15 * 60 * 1000;
        const refreshTokenMaxAge = 24 * 60 * 60 * 1000;
        const refreshToken = generateRefreshToken({ id: user._id, username: user.username, name: user.name, role: user.role })
        res.cookie('accessToken', accessToken, {
            // httpOnly: true,
            // secure: true,
            // sameSite: 'strict',
            maxAge: accessTokenMaxAge,
        });
        res.cookie('refreshToken', refreshToken, {
            maxAge: refreshTokenMaxAge,
        });
        return res.status(200).json({
            message: "Login Success",
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            picture: user.picture || null,
            gender: user.gender,
            birthday: user.birthday,
            isLoggedIn: true,
            bio: user.bio,
        });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

exports.forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(400).json({ error: "Email id you entered is not associated with any account | Try a different email id " });
        const otp = generateOtpForUser();
        const haveOTP = await ForgetPasswordModel.findOne({ email });
        if (haveOTP) {
            return res.status(200).json({ message: "OTP already sent to this email. Please check your email." });
        }
        await sendOtpEmail(otp, email, isResend = true, isReset = true)
        await ForgetPasswordModel.create({
            email,
            otp,
            expiresIn: new Date(new Date().getTime() + 10 * 60000)
        });
        res.status(200).json({ message: "Forget password request successful" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.forgetPasswordOtpVerify = async (req, res) => {
    try {
        const { email, otp } = req.body;
        let data = await ForgetPasswordModel.findOne({ email, otp });
        if (!data) return res.status(400).json({ error: "Invalid OTP or OTP expired" });
        res.status(200).json({ success: true, message: "OTP Verified Successfully" });
    } catch (e) {
        return res.status(400).json({ error: "Invalid OTP or OTP expired" })
    }
}

exports.forgetPasswordChange = async (req, res) => {
    try {
        const { password, email, otp } = req.body
        const user = await UserModel.findOne({ email })
        if (!user) res.send({ message: "User not found" })
        const checkPassword = await bcrypt.compare(password, user.password);
        if (checkPassword) res.status(400).json({ error: "New password and old password cannot be same" })
        else {
            let hashedPassword = await bcrypt.hash(password, 10);
            await UserModel.updateOne({ email }, { password: hashedPassword });
            await ForgetPasswordModel.deleteOne({ email });
            res.status(200).json({ message: "Password changed successfully. Please login with new password." });
        }
    } catch (error) {

    }
}
