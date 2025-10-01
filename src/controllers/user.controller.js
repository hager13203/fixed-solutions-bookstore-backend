const User = require("../../db/models/user.model");
const bcrypt = require("bcryptjs");

// ^----------------------------------Get All Users--------------------------
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude password
    res.status(200).json({ message: "Users founded", users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ^----------------------------------Get One User--------------------------
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({ message: "User not Found" });
    }
    res.status(200).json({ message: "User founded", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ^-----------------------------Update User (ID in Params / ID in Token)-----------------------
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id; // from URL param
    const authUserId = req.user.id; // from token (middleware)
    const authUserRole = req.user.role;

    // Only the owner or admin can update
    if (authUserId !== userId && authUserRole !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to update this user" });
    }

    const { oldPassword, newPassword, email, name, age } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // * Change password
    if (oldPassword && newPassword) {
      const isPasswordCorrect = await bcrypt.compare(
        oldPassword,
        user.password
      );
      if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Incorrect old password" });
      }
      user.password = await bcrypt.hash(
        newPassword,
        +process.env.USER_PASS_SALT_ROUNDS
      );
    }

    // * Change name
    if (name && name !== user.name) {
      user.name = name;
    }

    // * Change age
    if (age && age !== user.age) {
      user.age = age;
    }

    // * Change email (just replace, no activation check)
    if (email && email !== user.email) {
      const isEmailExists = await User.findOne({ email });
      if (isEmailExists) {
        return res.status(409).json({ message: "Email already exists" });
      }
      user.email = email;
    }

    await user.save();

    const updatedUser = await User.findById(userId).select("-password");

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// ^----------------------------------Delete User--------------------------
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const authUserId = req.user.id;
    const authUserRole = req.user.role;

    if (authUserId !== userId && authUserRole !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this user" });
    }

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
