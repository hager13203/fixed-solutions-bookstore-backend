// ^--------------------Imports
const { Router } = require("express");
const bookController = require("../controllers/book.controller");
const bookRouter = Router();
const validate = require("../middlewares/schemaValidation.middleware");
const {
  validateCreateBook,
  validateUpdateBook,
} = require("../validation/bookValidation");

// add book
bookRouter.post("/add", validate(validateCreateBook), bookController.addBook);

// get all books
bookRouter.get("/", bookController.getAllBooks);

// get book by id
bookRouter.get("/:id", bookController.getBookById);

// // update book by id
bookRouter.put("/:id", validate(validateUpdateBook), bookController.updateBook);

// // delete book by id
bookRouter.delete("/:id", bookController.deleteBook);

module.exports = bookRouter;
