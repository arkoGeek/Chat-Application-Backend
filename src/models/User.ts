import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username : {
    type : String,
    required : true
  },
  email : {
    type : String,
    required : true
  },
  password : {
    type : String,
    length : {
      min : 8
    },
    required : true
  }
}, {
  timestamps : true
});

const User = mongoose.model("User", UserSchema);

module.exports = User;