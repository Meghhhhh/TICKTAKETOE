require("./books.js")
require("./resources.js")
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 8,
  },
  name: {
    type: String,
    // maxlength: 35,
    // minlength: 2,
    trim: true,
  },
  authId: {
    type: String,
  },
  authType: {
    type: String,
  },

  profilePicture: {
    type: String,
    //default: "../images/defaultProfilePic.png",
  },

  phoneNumber: {
    type: String,
  },

  isAdmin: {
    type: Boolean,
    default: false,
  },
resourcesId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resources",
  },

  isLibrarian: { type: Boolean, default: false },

  borrowedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Books" }],

  bookHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Books" }],
  bookmarkedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Books" }],
  favouriteResources : [{ type: mongoose.Schema.Types.ObjectId, ref: "Resources" }],
});

userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
