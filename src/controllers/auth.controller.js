const userModel = require("../../db/models/user.model");
const bcrypt = require("bcryptjs");

// ^----------------------------------Registeration--------------------------
const Register = async (req, res) => {
  try {
    const { name, email, password, age, role } = req.body; 

    // 1. check if email exists
    const foundUser = await userModel.findOne({ email: email });
    if (foundUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // 2. hashing password
    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. save in db
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
      age,
      role,
    });

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

module.exports = { Register };
