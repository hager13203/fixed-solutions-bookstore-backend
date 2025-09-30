const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  age: Number,
  books_bought_amount: { type: Number, default: 0 },
  role: { type: String, enum: ["user", "admin"] },
});

module.exports = mongoose.model("User", userSchema);
