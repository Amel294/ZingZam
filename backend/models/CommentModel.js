const mongoose = require("mongoose");

const commentSchema  = mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: [true, "Post ID is required"],
        index: true
    },
    comments: [{
        text: {
            type: String,
            required: [true, "Comment text is required"],
            trim: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        replies: [{
            text: {
                type: String,
                required: [true, "Reply text is required"],
                trim: true
            },
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }]
    }],

    commentCount: {
        type: Number,
        default: 0
    },

}, {
    timestamps: true,
});

commentSchema.pre('save', function(next) {
    let commentCount = 0;
    this.comments.forEach(comment => {
        commentCount++; 
        commentCount += comment.replies.length; 
    });
    this.commentCount = commentCount;
    this.comments.sort((a, b) => b.createdAt - a.createdAt);
    this.latestComments = this.comments.slice(0, 2);
    next();
});

module.exports = mongoose.model('Comment', commentSchema);
