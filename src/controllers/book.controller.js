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
    const newbook = await book.create(req.body);
    res.status(201).json({ message: "book added Successfully", newbook });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};
// ^-----------------------------Update book (ID in Params / ID in Token)-----------------------
const updateBook = async (req, res, bookID) => {
  try {
    if (!bookID)
      return res
        .status(401)
        .json({ message: "you are not authorized to get this content" });
    const { title, description, amount } = req.body;
    const book = await Book.findById(bookID);
    if (!book) return res.status(404).json({ message: "book is not found" });
    // * change title
    if (title && title !== book.title) {
      book.title = title;
    }
    // * change description
    if (description && description !== book.description) {
      book.description = description;
    }
    // * change amount
    if (amount && amount !== book.amount) {
      book.amount = amount;
    }
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};
// // ^----------------------------------Delete book--------------------------
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(400).json({ message: "book not Found" });
    }
    res.status(200).json({ message: "book deleted Successfully", book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
};
