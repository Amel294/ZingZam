const mongoose = require("mongoose");

const likesSchema = mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: [true, "Post ID is required"],
        index: true
    },
    likedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User ID is required"]
    }],
    likeCount:{
        type:Number,
        default:0
    },
}, {
    timestamps: true,
});
likesSchema.pre('save', async function(next) {
    this.likeCount = this.likedUsers.length;
    next();
});

module.exports = mongoose.model('Likes', likesSchema);
