const mongoose = require("mongoose");

const postsSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User ID is required"],
        index: true
    },
    imageUrl : {
        type:String,
        required : [true,  "Image Url field can not be empty"]
    } ,
    caption:{
        type:String,
        required:true
    },
    isPrivate: { 
        type: Boolean,
        default: false 
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Post', postsSchema);
