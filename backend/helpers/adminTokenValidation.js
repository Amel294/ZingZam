const jwt = require('jsonwebtoken');

exports.adminTokenValidation = async (req, res, next) => {
    console.log("in admin tken validation")
    try {
        const adminToken = req.cookies.adminToken;
        if (!adminToken) {
            throw new Error('No Admin token found');
        } else {
            const decoded = await jwt.verify(adminToken, process.env.ADMIN_TOKEN_SECRET);
            req.adminData = {
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
