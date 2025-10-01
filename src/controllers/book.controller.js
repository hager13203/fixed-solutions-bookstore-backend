const Book = require("../../db/models/book.model");
// ^----------------------------------Get All books--------------------------
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json({ message: "books founded", books });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ^----------------------------------Get One book--------------------------
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(400).json({ message: "book not Found" });
    }
    res.status(200).json({ message: "book founded", book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ^----------------------------------Add book--------------------------
const addBook = async (req, res) => {
  try {
    const newBook = await Book.create({
      ...req.body,
      createdBy: req.user.id,
      createdAt: new Date(),
    });

    res.status(201).json({
      message: "Book added successfully",
      book: newBook,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ^-----------------------------Update book (ID in Params / ID in Token)-----------------------
const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // check if user is admin or the owner of the book
    if (
      req.user.role !== "admin" &&
      book.createdBy.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "You are not allowed to update this book" });
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json({
      message: "Book updated successfully",
      book: updatedBook,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// // ^----------------------------------Delete book--------------------------
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // check if user is admin or the owner of the book
    if (
      req.user.role !== "admin" &&
      book.createdBy.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this book" });
    }

    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  addBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
};
