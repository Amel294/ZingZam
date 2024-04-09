const mongoose = require("mongoose");

const savedPostSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    savedPost: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    }],
    
});

module.exports = mongoose.model('SavedPost', savedPostSchema);
