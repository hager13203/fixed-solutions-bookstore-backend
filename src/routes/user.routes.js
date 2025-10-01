// ^--------------------Imports
const { Router } = require("express");
const userController = require("../controllers/user.controller");
const validate = require("../middlewares/schemaValidation.middleware");
const userRouter = Router();
const {
  validateCreateUser,
  validateUpdateUser,
} = require("../validation/userValidation");
const authenticate = require("../middlewares/authentication.middleware");


// get all users
userRouter.get("/",authenticate(["admin"]), userController.getAllUsers);

// get user by id
userRouter.get("/:id", authenticate(["admin"]),userController.getUserById);

// update user by id
userRouter.patch(
  "/:id",
  authenticate(["user", "admin"]),
  validate(validateUpdateUser),
  userController.updateUser
);

// // delete user by id
userRouter.delete("/:id", authenticate(["user", "admin"]),userController.deleteUser);

module.exports = userRouter;
