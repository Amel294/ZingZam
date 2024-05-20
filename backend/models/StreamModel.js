const mongoose = require('mongoose');

const streamSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true 
    },
    streamKey: {
        type: String,
        required: true,
        unique: true
    },
    title : {
        type : String,
        require:true
    },
    isActive: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '24h'
    },
    supportReceived : [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        message:{type:String},
        coins: { type: Number },
        timestamp: { type: Date, default: Date.now },
    }]
});

module.exports = mongoose.model('Stream', streamSchema);
