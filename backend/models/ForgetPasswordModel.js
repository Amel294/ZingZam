const mongoose = require("mongoose");

const forgetPasswordSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true,
    },
    otp: {
        type: String,
        required: true,
    },
    expiresIn: {
        type: Date,
        required: true
    }
}, {
    timestamps: true,
    expires: 600 // expires after 10 minutes (600 seconds)
});

forgetPasswordSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

const ForgetPassword = mongoose.model("ForgetPassword", forgetPasswordSchema);

module.exports = ForgetPassword;
