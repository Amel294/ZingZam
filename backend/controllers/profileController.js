const { getDataFromJWTCookie_id } = require('../helpers/dataFromJwtCookies');
const UserModel = require('../models/UserModel')
const ConnectionModel = require('../models/ConnectionsModel')
exports.getProfile = async (req, res) => {
    
    const id = req.intercepted.id

    console.log(id);
    const requestedUserName = req.params.username.trim().toLowerCase().replace(/\s/g, '')
    const userData = await UserModel.findOne({ username: requestedUserName })
    const ownProfile = userData._id.toString() === id
    const connection = await ConnectionModel.findOne({ user: id }).populate('friends')
    if(userData.role !== "user"){
        res.send(200).json({message:"Unauthorized"})
    }
    
    resData = {
        name : userData.name,
        username : userData.username,
        picture : userData.picture,
        gender: userData.gender,
        birthday:userData.birthday,
        ownProfile,
        bio:userData.bio,
        friends : connection.friends || [],
        ownProfile
    }
        console.log(userData);
    res.status(200).json(resData);
}
