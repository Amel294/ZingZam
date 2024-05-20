const crypto = require('crypto');
const StreamModel = require('../models/StreamModel');

function generateUniqueKey() {
    return crypto.randomBytes(16).toString('hex');  
}

const  generateAndSaveUniqueKey = async (userId,title)=> {
    let unique = false;
    let newKey;

    while (!unique) {
        newKey = generateUniqueKey();
        const keyExists = await StreamModel.findOne({ streamKey: newKey });

        if (!keyExists) {
            unique = true;
        }
    }

    const newStreamKey = new StreamModel({
        title:title,
        userId: userId,
        streamKey: newKey,
        isActive: false
    });

    await newStreamKey.save();
    return newKey;
}

module.exports = {
    generateUniqueKey,
    generateAndSaveUniqueKey
};