const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: String,
  description: String,
  amount: { type: Number, default: 0 }, // stock
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: Date
}
);

module.exports = mongoose.model("Book", bookSchema);
