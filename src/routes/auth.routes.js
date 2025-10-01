const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth.controller");

//* user registeration
router.post("/register", auth.Register);
router.post("/login", auth.Login);

//* email activation

//* user login

//* user logout


module.exports = router;
