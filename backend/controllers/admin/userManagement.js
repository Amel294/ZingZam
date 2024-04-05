
const userModel = require('../../models/UserModel')
exports.userManagement =async (req,res) =>{
    try {
        const users = await userModel.find();
        res.status(201).json(users)
        console.log(users);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}
