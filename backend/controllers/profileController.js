const UserModel = require('../models/UserModel')
const ConnectionModel = require('../models/ConnectionsModel')
exports.getProfile = async (req, res) => {
    const id = req?.userData?.id;
    const requestedUserName = req.params.username.trim().toLowerCase().replace(/\s/g, '')
    const userData = await UserModel.findOne({ username: requestedUserName })
    if (!userData) {
        return res.status(200).json({ notFound: true });
    }
    const ownProfile = userData._id.toString() === id
    const connection = await ConnectionModel.findOne({ user: id }).populate('friends')
    if (userData.role !== "user") res.send(200).json({ message: "Unauthorized" })
    resData = {
        name: userData.name,
        username: userData.username,
        picture: userData.picture,
        gender: userData.gender,
        birthday: userData.birthday,
        ownProfile,
        bio: userData.bio,
        friends: connection?.friends || [],
        ownProfile
    }
    res.status(200).json(resData);
}

exports.updateName = async (req, res) => {
    try {
        const userId = req?.userData?.id;
        const { name } = req.body;
        const user = await UserModel.findByIdAndUpdate(userId, { name }, { new: true });
        res.status(200).json({
            message: "Name updated successfully",
            name: user.name,
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.updateUserName = async (req, res) => {
    try {
        const userId = req?.userData?.id;
        const username = req.body.username.trim().toLowerCase().replace(/\s/g, '');
        const user = await UserModel.findByIdAndUpdate(userId, { username }, { new: true });
        res.status(200).json({
            message: "Username updated successfully",
            username: user.username,
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.addOrChangeBio = async (req, res) => {
    try {
        const userId = req?.userData?.id;
        const bio = req.body.bio
        const user = await UserModel.findByIdAndUpdate(userId, { bio }, { new: true });
        if (!user) {
            return res.status(200).json({ notFound: true });
        }
        res.status(200).json({
            message: "Bio updated successfully",
            bio: user.bio,
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}