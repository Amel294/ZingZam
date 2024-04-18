const UserModel = require("../models/UserModel.js");

const isBlocked = async (req, res, next) => {
    try {
        const userId = req?.userData?.id;
        const user = await UserModel.findById(userId, { isBlocked: 1, _id: 0 });
        console.log("Blocked response is")
        console.log(user)
        if (!user) {
            throw new Error("User not found");
        }
        if (user.isBlocked === true) {
            res.cookie('accessToken', '', { maxAge: 0 });
            res.cookie('refreshToken', '', { maxAge: 0 });
            return res.status(403).json({
                success: false,
                message: "You are blocked by admin",
            })
        } else {
            next();
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = isBlocked;
