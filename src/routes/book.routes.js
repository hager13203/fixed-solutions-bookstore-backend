const { Router } = require("express");
const bookController = require("../controllers/book.controller");
const validate = require("../middlewares/schemaValidation.middleware");
const authenticate = require("../middlewares/authentication.middleware");
const {
  validateCreateBook,
  validateUpdateBook,
} = require("../validation/bookValidation");

const bookRouter = Router();

// Middleware: check if user is owner or admin for update/delete
const authorizeBookOwner = async (req, res, next) => {
  if (req.user.role === "user") {
    const book = await require("../../db/models/book.model").findById(
      req.params.id
    );
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not allowed to modify this book" });
    }
  }
  next();
};

// Middleware: check if user can buy book
const canBuyBook = async (req, res, next) => {
  const book = await require("../../db/models/book.model").findById(
    req.params.id
  );
  if (!book) return res.status(404).json({ message: "Book not found" });
  if (book.createdBy.toString() === req.user.id) {
    return res.status(400).json({ message: "You cannot buy your own book" });
  }
  req.book = book; // pass to controller
  next();
};

// Routes
bookRouter.get("/", bookController.getAllBooks);
bookRouter.get("/:id", bookController.getBookById);

bookRouter.post(
  "/add",
  authenticate(["user", "admin"]),
  validate(validateCreateBook),
  bookController.addBook
);

bookRouter.put(
  "/:id",
  authenticate(["user", "admin"]),
  validate(validateUpdateBook),
  authorizeBookOwner,
  bookController.updateBook
);

bookRouter.delete(
  "/:id",
  authenticate(["user", "admin"]),
  authorizeBookOwner,
  bookController.deleteBook
);

bookRouter.post(
  "/:id/buy",
  authenticate(["user"]),
  canBuyBook,
  bookController.buyBook
);

module.exports = bookRouter;
