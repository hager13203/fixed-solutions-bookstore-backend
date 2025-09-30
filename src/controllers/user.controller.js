const User = require("../../db/models/user.model");
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
// ^----------------------------------Add User--------------------------
const addUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({ message: "User added Successfully", newUser });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};
// ^-----------------------------Update User (ID in Params / ID in Token)-----------------------
// const updateUser = async (req, res, userID) => {
//   try {
//     if (!userID) return res.status(401).json({ message: "you are not authorized to get this content" });

//     const { oldPassword, newPassword, email, name , age} = req.body;

//     const user = await User.findById(userID);

//     if (!user) return res.status(404).json({ message: "user is not found" });

//     // * change password
//     if (oldPassword && newPassword) {
//       const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

//       if (!isPasswordCorrect) return res.status(401).json({ message: "incorrect password" });

//       user.password = await bcrypt.hash(newPassword, +process.env.USER_PASS_SALT_ROUNDS);

//     }

//     // * change name
//     if (name && name !== user.name) {
//       user.name = name;
//     }

//     if (email && email !== user.email) {
//       // * change email
//       const isEmailExists = await User.findOne({ email });

//       if (isEmailExists) return res.status(409).json({ message: "this email already exists" });

//       user.email = email;
//       user.isEmailActive = false;
//       await user.save(); //? save before redirecting
//     //   generateAndSendActivationEmail(user);
//     }

//     await user.save();

//     const updatedUser = await User.findById(userID).select("-createdAt -updatedAt -password -isEmailActive");

//     res.status(200).json({ message: "user is updated successfully", data: updatedUser });
//   } catch (err) {
//     res.status(500).json({ message: "server error" });
//   }
// };
// // ^----------------------------------Delete User--------------------------
// const deleteUser = async (req, res) => {
//   try {
//   } catch (error) {}
// };

module.exports = {
  addUser,
  getAllUsers,
  getUserById,
};
