const UserModel = require("../models/UserModel.js");

exports.isBlocked = async (req, res, next) => {
    try {
        const userId = req.userData?.id;
        const user = await UserModel.findById(userId, { isBlocked: 1 });
        if (!user) {
            throw new Error("User not found");
        }
        if (user.isBlocked) {
            res.cookie('accessToken', '', { maxAge: 0 });
            res.cookie('refreshToken', '', { maxAge: 0 });
            return res.status(403).json({
                blocked: true,
                success: false,
                message: "You are blocked by admin",
            });
        }
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};