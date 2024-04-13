const { validateLength, validatePassword } = require('../helpers/ValidationHelper');
const UserModel = require('../models/UserModel');
const RefreshTokenModel = require('../models/RefreshTokenModel')
const validator = require('validator');
const bcrypt = require("bcrypt");
const TempUserModel = require('../models/TempUserModel');
const { generateOtpForUser, sendOtpEmail } = require('../helpers/mail');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken, generateTempToken } = require('../helpers/tokens');
const { getDataFromJWTCookie_temporaryToken } = require('../helpers/dataFromJwtCookies');
exports.register = async (req, res) => {
    try {
        let { email, name, gender, password, birthday } = req.body;
        console.log(req.body)
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
        console.log(cryptedPassword);
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
        console.log("data form jwt cookie temp for verification")
        console.log(data.email)
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
            console.error('Error verifying token:', error);
            res.status(500).send({ error: 'Internal server error' });
        }
    }
};
exports.resend = async (req, res) => {
    try {
        const jwtToken = req?.cookies?.tempToken;
        const data = getDataFromJWTCookie_temporaryToken(res, jwtToken);
        console.log("data form jwt cookie temp")
        console.log(data)
        const otp = generateOtpForUser()
        const tempTokenMaxAge = 5 * 60 * 1000;
        const tempToken = await generateTempToken({
            name:data.name,
            email:data.email,
            password: data.password,
            username:data.username,
            gender:data.gender,
            birthday:data.birthday,
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
            message:"Resend OTP send successfully"
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
        });

    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
