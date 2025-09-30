const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("MONGODB_URI:", process.env.MONGODB_URI); // Debug log
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connected to mongodb");
  } catch (error) {
    console.log("error connecting to mongoDB", error);
  }
};

module.exports = connectDB;
