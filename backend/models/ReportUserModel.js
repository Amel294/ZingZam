const mongoose = require('mongoose');

// Define schema
const reportSchema = new mongoose.Schema({
    reportId: { type: String, required: true },
    reportedUser: { type: String, required: true },
    numberOfReports: { type: Number, required: true },
    lastReportAt: { type: Date, required: true },
    reportType: { type: String, enum: ['spam', 'harassment', 'inappropriate_content'], required: true },
    postId: { type: String },
    screenshots: [{ type: String }],

    // Additions
    reportMessage: { type: String, required: true }, // Detailed explanation of the report
    status: { type: String, enum: ['open', 'in_review', 'closed'], default: 'open' },  // Status of the report
    reviewerNotes: { type: String } // Notes from the reviewer
});

// Define model
const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
