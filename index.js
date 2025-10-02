const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRouter = require("./src/routes/user.routes");
const connectDB = require("./db/dbConnection");
const bookRouter = require("./src/routes/book.routes");
const authRouter = require("./src/routes/auth.routes");
const cookieParser = require("cookie-parser");
const swaggerDoc = require("./swagger/swaggerDoc.js");
const cors = require("cors");  
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;


// middleware to parse JSON 
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
connectDB();

// Enable CORS 
const allowedOrigins = ["http://localhost:7005", "http://localhost:8000"]; 

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); 
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true 
}));


// ^--------------------Health Check
app.get("/health", async (req, res) => {
  const dbState = mongoose.connection.readyState;
  if (dbState === 1) {
    res.status(200).json({ status: "UP", db: "connected" });
  } else {
    res.status(500).json({ status: "DOWN", db: "disconnected" });
  }
});

// ^--------------------Swagger UI
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger/swagger.json");
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      requestInterceptor: (req) => {
        req.credentials = "include"; // send cookies
        return req;
      },
    },
  })
);

// ^--------------------Main Routes
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/books", bookRouter);

// ^--------------------Start Server
app.listen(PORT, () => {
  console.log("http://localhost:" + PORT);
});
