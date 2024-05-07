const { default: mongoose } = require("mongoose");
const { generateAndSaveUniqueKey } = require("../../helpers/generateAndSaveUniqueKey");
const StreamModel = require("../../models/StreamModel");

exports.generateStreamKey = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req?.userData?.id)
            
        const existingKey = await StreamModel.findOne({ userId: userId });
        if(existingKey){
            return res.json({streamKey:existingKey.streamKey})
        }
        const newKey = await generateAndSaveUniqueKey(userId) 
        res.json({ streamKey: newKey });
    } catch (error) {
        res.status(500).json({ message: "Error generating stream key", error: error.message });
    }
}

exports.validateStreamKey = async (req,res) =>{
    try {
        console.log("In stream key validation")
        const {streamKey }  = req.body
        console.log("streamKey")
        console.log(streamKey)
        const existingKey = await StreamModel.findOne({ streamKey: streamKey });
        console.log(existingKey)
        if(existingKey){
            return res.status(200).json({isValid:true})
        }else{
            return res.status(404).json({isValid:false})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error validating stream key", error: error.message });
    }
}
exports.deleteStreamKey = async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req?.userData?.id)

    let deletedCount = await StreamModel.deleteOne({  userId });

    if (deletedCount.number === 0) {
        return res.status(404).json({ message: "Stream key not found" });
    } else {
        return res.status(200).json({ message: "Stream key deleted successfully" });
    }
};
