const mongoose = require('mongoose');

const ZingCoinsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    coins: {
        type: Number,
        required: true
    },
    purchases: [{
        coinPackName: { type: String },
        purchaseAmount: { type: Number },
        coins: { type: Number },
        razorpayOrderId:{type:String},
        timestamp: { type: Date, default: Date.now }
    }],
    donationsSend: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    donationsReceived: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('ZingCoins', ZingCoinsSchema);
