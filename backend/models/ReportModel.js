const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        default: null
    },
    streamKey: {
        type: String,
        default: null
    },
    type: {
        type: String,
        enum: ['post', 'stream'],
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    reportedUser: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['open', 'in_review', 'closed'],
        default: 'open'
    },
    actionTaken: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
