const mongoose = require('mongoose');

const streamChatSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        index: true
    },
    messages: [
        {
            senderId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
                index: true
            },
            text: {
                type: String,
            },
            gift: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Gift'
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, {
    timestamps: true,
    expires: 600
});

module.exports = mongoose.model('StreamChat', streamChatSchema);
