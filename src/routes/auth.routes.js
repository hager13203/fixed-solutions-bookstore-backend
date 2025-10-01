const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth.controller");

//* user registeration
router.post("/register", auth.Register);

//* email activation

//* user login
router.post("/login", auth.Login);

//* user logout


module.exports = router;
