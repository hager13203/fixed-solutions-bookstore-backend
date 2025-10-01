const jwt = require("jsonwebtoken");
const verifyToken = require("../utils/verifyToken");

//* Middleware to verify token
const authenticate = (roles = []) => {
  return (req, res, next) => {
    //~ 1- authentication
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized, no token provided" });
    }

    try {
      // verify token
      const decoded = verifyToken(token, process.env.JWT_SECRET);

      //~ authorization
      if (!roles.includes(decoded?.role)) {
        return res
          .status(401)
          .json({ message: "you are not authorized to get this content" });
      }

      req.user = decoded;
      next(); 
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        //* 1- Safely decode token payload without verifying signature
        const decoded = jwt.decode(token);

        //* 2- If token structure is invalid, respond with 401
        if (!decoded) {
          return res.status(401).json({ message: "Invalid token structure" });
        }

        return res
          .status(401)
          .json({ message: "Token expired, please login again" });
      } else {
        //* 3- If token is invalid for any other reason
        return res.status(401).json({ message: "Invalid token" });
      }
    }
  };
};

module.exports = authenticate;
