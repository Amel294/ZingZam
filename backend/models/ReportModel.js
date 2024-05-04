const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    reportedUser: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    status: {
        type: String,
        enum: ['open', 'in_review', 'closed'],
        default: 'open'
    },
    actionTaken: {
        type: String
    }
}, {
    timestamps: true
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
