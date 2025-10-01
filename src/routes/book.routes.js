// ^--------------------Imports
const { Router } = require("express");
const bookController = require("../controllers/book.controller");
const validate = require("../middlewares/schemaValidation.middleware");
const {
  validateCreateBook,
  validateUpdateBook,
} = require("../validation/bookValidation");
const authenticate = require("../middlewares/authentication.middleware");

const bookRouter = Router();

// add book (User or Admin can add)
bookRouter.post(
  "/add",
  authenticate(["user", "admin"]),
  validate(validateCreateBook),
  bookController.addBook
);

// get all books 
bookRouter.get("/", bookController.getAllBooks);

// get book by id 
bookRouter.get("/:id", bookController.getBookById);

// update book by id
bookRouter.put(
  "/:id",
  authenticate(["user", "admin"]),
  validate(validateUpdateBook),
  async (req, res, next) => {

    if (req.user.role === "user") {
      const book = await bookController.findBookById(req.params.id); 
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      if (book.createdBy.toString() !== req.user.id) {
        return res
          .status(403)
          .json({ message: "You are not allowed to update this book" });
      }
    }
    next();
  },
  bookController.updateBook
);

// delete book by id
bookRouter.delete(
  "/:id",
  authenticate(["user", "admin"]),
  async (req, res, next) => {
    if (req.user.role === "user") {
      const book = await bookController.findBookById(req.params.id);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      if (book.createdBy.toString() !== req.user.id) {
        return res
          .status(403)
          .json({ message: "You are not allowed to delete this book" });
      }
    }
    next();
  },
  bookController.deleteBook
);

module.exports = bookRouter;
