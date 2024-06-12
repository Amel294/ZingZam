const mongoose = require("mongoose")

const tempUserSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true,
  },
  otp: {
    type: String,
    default: false,
    required: true,
  },
  expiresIn: {
    type: Date,
    required: true,
  },
  verificationAttempts: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
  expires: 600
})
tempUserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

module.exports = mongoose.model('TempUser', tempUserSchema)
