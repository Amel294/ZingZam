const jwt = require('jsonwebtoken');

exports.getDataFromJWTCookie_temporaryToken = (res,jwtToken) => {
    if (!jwtToken) {
        return res.status(401).json({ message: "JWT not found in cookie" });
    }
    const decodedPayload = jwt.verify(jwtToken, process.env.TEMP_TOKEN_SECRET);
    if (!decodedPayload) console.log("No data in Payload")
    return decodedPayload;
}