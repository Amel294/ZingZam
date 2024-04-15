const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
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
    type: Date, // Store the complete birthday as a Date field
    required: true,
  },
  bio:{
    type: String,
    default: ""
  },
  verified: {
    type: Boolean,
    default: false
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"]
  },
}, {
  timestamps: true,
})

module.exports = mongoose.model('User', userSchema)//NOTES:Here "User" is the name that will be in the database and it will be chnaged to Users by mongoDB
