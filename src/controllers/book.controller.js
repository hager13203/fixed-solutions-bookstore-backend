const Book = require("../../db/models/book.model");
const User = require("../../db/models/user.model");

// ^----------------------------------Get All Books--------------------------
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate("createdBy", "name email");
    res.status(200).json({ message: "Books found", books });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ^----------------------------------Get One Book--------------------------
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.status(200).json({ message: "Book found", book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ^----------------------------------Add Book--------------------------
const addBook = async (req, res) => {
  try {
    const newBook = await Book.create({
      ...req.body,
      createdBy: req.user.id,
      createdAt: new Date(),
    });
    res.status(201).json({ message: "Book added successfully", book: newBook });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ^----------------------------------Update Book--------------------------
const updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ message: "Book updated successfully", book: updatedBook });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ^----------------------------------Delete Book--------------------------
const deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ^----------------------------------Buy Book--------------------------
const buyBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // Check if the book is out of stock
    if (book.amount <= 0) {
      return res.status(400).json({ message: "Book is out of stock" });
    }

    // Prevent owner from buying their own book
    if (book.createdBy.toString() === req.user.id) {
      return res.status(400).json({ message: "You cannot buy your own book" });
    }

    // Fetch the user
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update stock
    book.amount -= 1;
    await book.save();

    // Update user's bought books count
    user.books_bought_amount = (user.books_bought_amount || 0) + 1;
    await user.save();

    res.status(200).json({
      message: "Book bought successfully",
      remainingStock: book.amount,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
  buyBook,
};