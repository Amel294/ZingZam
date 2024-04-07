const { getDataFromJWTCookie_id } = require('../helpers/dataFromJwtCookies');
const UserModel = require('../models/UserModel')

exports.getProfile = async (req, res) => {
    const jwtToken = req?.cookies?.accessToken;
    const id = getDataFromJWTCookie_id(res, jwtToken);

    console.log(id);
    const requestedUserName = req.params.username.trim().toLowerCase().replace(/\s/g, '')
    const userData = await UserModel.findOne({ username: requestedUserName })
    const ownProfile = userData._id.toString() === id
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
        
    }
        console.log(userData);
    res.status(200).json(resData);
}