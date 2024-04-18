const jwt = require('jsonwebtoken');
const { generateAccessToken } = require('./tokens');

exports.accessTokenValidation = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken){
            return res.status(403).json({
                noRefreshToken: true,
                success: false,
                message: "Token expired or not Available",
            });
        }
        if (!accessToken) {
            const newAccessToken = await refreshAccessToken(req, res, refreshToken);
            req.accessToken = newAccessToken;
            const accessTokenMaxAge = 15 * 60 * 1000;
            res.cookie('accessToken', newAccessToken, { maxAge: accessTokenMaxAge });
        } else {
            const decoded = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            req.userData = {
                id: decoded.id,
                username: decoded.username,
                name: decoded.name,
                role: decoded.role
            };
        }
        next();
    } catch (error) {
        return res.status(401).json({ error: error.message || 'Unauthorized', isValid: false });
    }
};

const refreshAccessToken = async (req, res, refreshToken) => {
    try {
        if (!refreshToken) {
            throw new Error('No refresh token found');
        }
        const decoded = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        req.userData = {
            id: decoded.id,
            username: decoded.username,
            name: decoded.name,
            role: decoded.role
        };
        const newAccessToken = generateAccessToken(req.userData);
        return newAccessToken;
    } catch (error) {
        throw new Error('Invalid refresh token');
    }
};
