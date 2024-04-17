const jwt = require('jsonwebtoken');
const { generateAccessToken } = require('./tokens');

exports.accessTokenValidation = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;

        if (!accessToken) {
            const newAccessToken = await refreshAccessToken(req, res, refreshToken);
            req.accessToken = newAccessToken;
            const accessTokenMaxAge = 15 * 60 * 1000; 

            res.cookie('accessToken', newAccessToken, {
                maxAge: accessTokenMaxAge,
                // httpOnly: true, 
                // secure: true, 
                // sameSite: 'strict' 
            });
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
        return res.status(401).json({ error: 'Invalid Access Token', isValid: false });
    }
};

const refreshAccessToken = async (req, res, refreshToken) => {
    try {
        if (!refreshToken) {
            return res.status(401).json({ message: 'No refresh token found', isValid: false });
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
        return res.status(401).json({ error: "Invalid refresh token", isValid: false });
    }
};
