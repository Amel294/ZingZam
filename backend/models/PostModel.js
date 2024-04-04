const mongoose = require("mongoose");

const postsSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model's ObjectId
        ref: 'User', // Refers to the 'User' model
        required: [true, "User ID is required"],
    },
    username: {
        type: String,
        required: [true, "Username is required"],
    },
    imageUrl : {
        type:String,
        required : [true,  "Image Url field can not be empty"]
    } ,
    caption:{
        type:String,
        required:true
    },
    
    // comments: [{
    //     text: {
    //         type: String,
    //         required: [true, "Comment text is required"],
    //         trim: true
    //     },
    //     userId: {
    //         type: String,
    //         required: [true, "User ID is required"],
    //         trim: true
    //     },
    //     username: {
    //         type: String,
    //         required: [true, "Username is required"],
    //         trim: true
    //     },
    //     createdAt: {
    //         type: Date,
    //         default: Date.now
    //     }
    // }],
    likes: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Post', postsSchema);
