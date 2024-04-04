const mongoose = require("mongoose")

const tempUserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    text: true,
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    text: true,
    unique: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  picture: {
    type: String,
    default: "",
  },
  gender: {
    type: String,
    required: [true, "Gender is required"],
    trim: true,
  },
  birthday: {
    type: Date, 
    required: true,
  },
  tempToken: {
    type: String,
    default: false,
    required: true,
  },
  otp: {
    type: String,
    default: false,
    required: true,
  }

}, {
  timestamps: true,
  expires: 300 

})
tempUserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

module.exports = mongoose.model('TempUser', tempUserSchema)
