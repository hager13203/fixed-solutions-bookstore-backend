const express = require("express");
const app = express();
const PORT = process.env.PORT || 7005;
require("dotenv").config();

const mongoose = require("mongoose");
app.use(express.json());

// health check
app.get("/health", async (req, res) => {
  const dbState = mongoose.connection.readyState;
  if (dbState === 1) {
    res.status(200).json({ status: "UP", db: "connected" });
  } else {
    res.status(500).json({ status: "DOWN", db: "disconnected" });
  }
});


// MongoDB Connection
(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connected to mongodb");
  } catch (error) {
    console.log("error connecting to mongoDB", error);
  }
})();

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
});

const User = mongoose.model("User", userSchema);

// CRUD Operations
// Create
app.post("/api/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// Read

//^ get all users
app.get("/api/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});
//^ get one user
app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: "invalid id " });
  }
});

// Update
app.put("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: "invalid id " });
  }
});

// Delete
app.delete("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted" });
  } catch {
    res.status(400).json({ error: "Invalid ID" });
  }
});

// start server
app.listen(PORT, () => {
  console.log("http://localhost:" + PORT);
});
