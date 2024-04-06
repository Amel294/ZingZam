const mongoose = require("mongoose");

const postsSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User ID is required"],
    },
    imageUrl : {
        type:String,
        required : [true,  "Image Url field can not be empty"]
    } ,
    caption:{
        type:String,
        required:true
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
        }
    }],
    likes: {
        type: Number,
        default: 0
    },
    likeCount:{
        type:Number,
        default:0
    },
    commentCount :{
        type:Number,
        default:0
    }
}, {
    timestamps: true,
});

postsSchema.pre('save', async function(next) {
    this.likeCount = this.likes.length;
    this.commentCount = this.comments.length;
    next();
});

module.exports = mongoose.model('Post', postsSchema);
