const mongoose = require("mongoose");
const USERS = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "please add a first name "],
    },
    middleName: {
      type: String,
    },
    lastName: {
      type: String,
      required: [true, "please add a last name "],
    },
    profile_image: {
      type: String,
    },
    userName: {
      type: String,
      required: [true, "please add a user name "],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "please add an email "],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "please add a password "],
    },
    role: {
      type: String,
      required: [true, "please specify a role"],
      default: "STUDENT",
    },
    blog_owner: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
    pictureUrl: { type: String },
    bio: { type: String },
    phoneNumber: { type: String },
    level: { type: String },
    department: { type: String },
    faculty: { type: String },

  },

  {
    timestamps: true,
  }
);
module.exports = mongoose.model("USER", USERS);