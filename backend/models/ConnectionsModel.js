const mongoose = require("mongoose");

const connectionsSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default:[]
    }],
    requestsSend: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default:[]
    }],
    requestsReceived: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default:[]
    }],
});

module.exports = mongoose.model('Connections', connectionsSchema);
