// models/user.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  registration: { type: String },
  tasks: [
    {
      formNumber: { type: String, unique: true },
      taskName: { type: String },
      taskDescription: { type: String },
      formDateTime: { type: Date },
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
