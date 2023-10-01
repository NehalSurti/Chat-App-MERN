const mongoose = require("mongoose");
const { Schema } = mongoose;

userSchema = new Schema({
  username: {
    type: String,
    min: 3,
    max: 16,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    max: 50,
  },
  password: {
    type: String,
    required: true,
    min: 8
  },
  isAvatarImageSet: {
    type: Boolean,
    default: false
  },
  avatarImage: {
    type: String,
    default: ""
  }
});

exports.User = mongoose.models.User
  ? mongoose.model("User")
  : mongoose.model("User", userSchema);
// console.log(mongoose.models.User);
