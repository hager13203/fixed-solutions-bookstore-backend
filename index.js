const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRouter = require("./src/routes/user.routes");
const connectDB = require("./db/dbConnection");
const bookRouter = require("./src/routes/book.routes");
const authRouter = require("./src/routes/auth.routes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// middleware to parse JSON 
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();

// ^--------------------Health Check
app.get("/health", async (req, res) => {
  const dbState = mongoose.connection.readyState;
  if (dbState === 1) {
    res.status(200).json({ status: "UP", db: "connected" });
  } else {
    res.status(500).json({ status: "DOWN", db: "disconnected" });
  }
});

// ^--------------------Main Routes
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/books", bookRouter);

// ^--------------------Start Server
app.listen(PORT, () => {
  console.log("http://localhost:" + PORT);
});
