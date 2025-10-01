const userModel = require("../../db/models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ^----------------------------------Registeration--------------------------
const Register = async (req, res) => {
  try {
    let user = req.body;

    // 1. check if email exists
    const foundUser = await userModel.findOne({ email: user.email });
    if (foundUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // 2. hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    user.email = user.email.toLowerCase();

    // 3. save in db
    const newUser = await userModel.create(user);

    // 4. send success msg without password
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        age: newUser.age,
        role: newUser.role,
        books_bought_amount: newUser.books_bought_amount,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error.",
      error: error.message,
    });
  }
};

// ^----------------------------------Login --------------------------
const Login = async (req, res) => {
  try {
    // 1- get email and password from req.body
    let { email, password } = req.body;
    email = email.toLowerCase();

    // 2- check if Email exists
    const foundUser = await userModel.findOne({ email });
    if (!foundUser) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 3- check if password is correct
    const isPasswordCorrect = await bcrypt.compare(
      password,
      foundUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // 4- generate user token
    const token = jwt.sign(
      { email: foundUser.email, id: foundUser._id, role: foundUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5- send token in http-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax", // "none" for deployment
      secure: false, // false for dev, true for production with HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    // 6- send success msg
    res.status(200).json({
      message: "Login successful",
      user: {
        id: foundUser._id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { Register, Login };
