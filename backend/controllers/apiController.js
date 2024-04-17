const jwt = require('jsonwebtoken');
const { generateAccessToken } = require('../helpers/tokens');

const tokenValidateAccessAndRefresh = async (req, res, next) => {
    try {
        const refreshToken = req?.cookies?.refreshToken;
        const accessToken = req?.cookies?.refreshToken;
        if (!refreshToken) {
            console.log("No refresh token found.");
            return res.status(401).json({ message: 'No refresh token found', isValid: false });
        }

        console.log("Refresh token found. Verifying...");
        const verifyRefreshTokenToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        if (verifyRefreshTokenToken) {
            console.log("Refresh token is valid. Generating new access token...");
            const newAccessToken = generateAccessToken({ id: verifyRefreshTokenToken.id });
            const accessTokenMaxAge = 15 * 60 * 1000; // 15 minutes in milliseconds

            res.cookie('accessToken', newAccessToken, {
                maxAge: accessTokenMaxAge,
            });

            console.log("New access token generated and saved.");
            next(); // Proceed to the next middleware
        }
        else {
            console.error("Invalid refresh token.");
            return res.status(401).json({ error: "Invalid refresh token", isValid: false });
        }
    } catch (error) {
        console.error("Error refreshing token:", error);
        return res.status(500).json({ error: 'Internal server error', isValid: false });
    }
};
