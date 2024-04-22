const jwt = require('jsonwebtoken');

exports.generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

exports.generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
};

exports.generateTempToken = (payload) => {
    return jwt.sign(payload, process.env.TEMP_TOKEN_SECRET, { expiresIn: '5m' });
};

exports.generateAdminToken = (payload) => {
    return jwt.sign(payload, process.env.ADMIN_TOKEN_SECRET, { expiresIn: '1d' });
};