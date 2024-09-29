const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/asyncMiddleware.js");
const isLoggedIn = require("../middleware/isLoggedIn.js");
const Book = require("../models/books.js");
const User = require("../models/user.js");
const Lend = require("../models/lending.js");

router.post("/lendBook", isLoggedIn, async (req, res) => {
  try {
    const { ISBN, endDate, email } = req.body;
    const currDate = new Date();

    // Ensure endDate is a Date object if it comes as a string
    const formattedEndDate = new Date(endDate);

    // Check if endDate is not earlier than today
    if (formattedEndDate < currDate.setHours(0, 0, 0, 0))
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Invalid date",
        data: null,
      });

    const book = await Book.findOne({ ISBN });
    if (!book)
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Invalid book ID",
        data: null,
      });

    const bookId = book._id;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({
        success: false,
        status: 400,
        message: "No user found",
        data: null,
      });

    if (book.quantity > 0) {
      book.quantity = book.quantity - 1;
      user.borrowedBooks.push(bookId);
      user.bookHistory.push(bookId);

      const lend = new Lend({
        lendedBy: user._id,
        lendedBook: bookId,
        startDate: Date.now(),
        endDate: formattedEndDate,
      });

      const lendedDetails = await lend.save();
      await user.save();
      await book.save();
      return res.status(200).json({
        success: true,
        status: 200,
        message: "Book lending successful",
        data: lendedDetails,
      });
    } else {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Book not available",
        data: null,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post(
  "/unlendBook",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { ISBN, email } = req.body;
    const book = await Book.findOne({ ISBN });
    if (!book) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Invalid book ID",
        data: null,
      });
    }
    const bookId = book._id;
    const user = await User.findOne({ email });

    if (user.borrowedBooks.includes(bookId)) {
      book.quantity = book.quantity + 1;
      user.borrowedBooks.pull(bookId);

      const lend = await Lend.findOne({
        lendedBy: user._id,
        lendedBook: bookId,
      });
      if (!lend) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: "Lend record not found",
          data: null,
        });
      }
      await Lend.findByIdAndDelete(lend._id);

      return res.status(200).json({
        success: true,
        status: 200,
        message: "Unlended successfully",
        data: null,
      });
    } else {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Book not lended",
        data: null,
      });
    }
  })
);

module.exports = router;
