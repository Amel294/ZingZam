
const UserModel = require('../../models/UserModel')
exports.userManagement =async (req,res) =>{
    try {
        const users = await UserModel.find({role:"user"},{name : 1 ,username : 1,email : 1 ,picture:1,isBlocked:1});
        res.status(201).json(users)
        console.log(users);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}

exports.blockUnblock = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(userId)
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        user.isBlocked = !user.isBlocked;
        await user.save();
        res.status(200).json({ message: "User block/unblock status updated successfully", isBlocked: user.isBlocked });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};
