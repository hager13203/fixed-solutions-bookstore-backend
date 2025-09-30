// ^--------------------Imports
const { Router } = require("express");
const userController = require("../controllers/user.controller");
const  validate  = require("../middlewares/schemaValidation.middleware");
const {
  validateCreateUser,
  validateUpdateUser,
} = require("../validation/userValidation");
const userRouter = Router();

// add user
userRouter.post("/add",validate(validateCreateUser), userController.addUser);

// get all users
userRouter.get("/", userController.getAllUsers);

// get user by id
userRouter.get("/:id", userController.getUserById);

// // update user by id
// userRouter.put("/:id", validate(validateUpdateUser),userController.updateUser);

// // delete user by id
// userRouter.delete("/:id", userController.deleteUser);

module.exports = userRouter;
