const jwt = require('jsonwebtoken');
const { generateAccessToken } = require('../helpers/tokens');

exports.accessTokenValidation = async (req, res) => {
    try {
        const accessToken = req?.cookies?.accessToken;
        
        if (!accessToken) {
            await refreshToken(req, res); 
        } else {
            console.log("has Access token");
            const verifyAccessTokenToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            if (verifyAccessTokenToken) {
                return res.status(200).json({ message: 'User has Access' ,isValid: true,});
            }
        }
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            await refreshToken(req, res);
        } else {
            return res.status(200).json({ error: 'Invalid Access Token' ,isValid: false});
        }
    }
};

const refreshToken = async (req, res) => {
    try {
        const refreshToken = req?.cookies?.refreshToken;
        if (!refreshToken) {
            return res.status(200).json({  message: 'No refresh token',isValid: false });
        }
        console.log("Refresh token found")

        const verifyRefreshTokenToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        if (verifyRefreshTokenToken) {
            const newAccessToken = generateAccessToken({ id: verifyRefreshTokenToken.id });
            const accessTokenMaxAge = 15 * 60 * 1000; // 15 minutes in milliseconds

            res.cookie('accessToken', newAccessToken, {
                // httpOnly: true,
                // secure: true,
                // sameSite: 'strict',
                maxAge: accessTokenMaxAge,
            });
            return res.status(200).json({ message: "New access token generated from refresh token",isValid: true });
        }
        else {
            return res.status(200).json({ error: "Invalid refresh token" ,isValid: false});

        }

    }

    catch (error) {
        res.status(500).json({ error: 'Invalid Refresh Token', isValid: false });
    }
}