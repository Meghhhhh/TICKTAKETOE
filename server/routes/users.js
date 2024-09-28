const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const catchAsync = require("../utils/asyncMiddleware.js");
const isLoggedIn = require("../middleware/isLoggedIn.js");
const isAdmin = require("../middleware/isAdmin.js");
const Book = require("../models/books.js");

router.get(
  "/getUser",
  [isLoggedIn],
  catchAsync(async (req, res) => {
    const { email, name, profilePicture, phoneNumber, isAdmin, authType, _id } =
      req.user.user;
    res.json({
      success: true,
      status: 200,
      message: "User fetched successfully",
      data: {
        email,
        name,
        profilePicture,
        phoneNumber,
        isAdmin,
        authType,
        _id,
      },
    });
  })
);

router.post(
  "/deleteUser",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const user = await User.findById(req.user.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "User not found",
        data: deletedUser,
      });
    }

    await User.findByIdAndDelete(req.user.user._id);

    if (req.user.user.authType === "google") {
      if (req.user && req.user.accessToken) {
        const token = req.user.accessToken;
        fetch(`https://oauth2.googleapis.com/revoke?token=${token}`, {
          method: "POST",
          headers: {
            "Content-type": "application/x-www-form-urlencoded",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Token revoked:", data);
          })
          .catch((err) => {
            console.error("Error revoking token:", err);
          });
      }
    }

    req.logout((err) => {
      if (err) {
        console.log(err);
      }

      req.session.destroy((error) => {
        if (error) {
          console.log(error);
        }

        res.clearCookie("connect.sid");

        res.json({
          success: true,
          status: 200,
          message: "User deleted successfully",
          data: null,
        });
      });
    });
  })
);

router.put(
  "/updateUser",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { name, phoneNumber } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.user._id,
      { name, phoneNumber },
      { new: true }
    );
    const updatedUser = await user.save();
    res.status(200).json({
      success: true,
      status: 200,
      message: "Profile updated successfully",
      data: {
        name: updatedUser.name,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
      },
    });
  })
);

router.post(
  "/createAdmin",
  [isLoggedIn, isAdmin],
  catchAsync(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Incorrect email",
        data: null,
      });
    }

    if (user.isAdmin)
      return res.status(400).json({
        success: false,
        status: 400,
        message: "User is already an admin",
        data: null,
      });

    user.isAdmin = true;
    const newUser = await user.save();

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Admin added successfully",
      data: {
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        name: newUser.name,
        phoneNumber: newUser.phoneNumber,
      },
    });
  })
);

router.post(
  "/favouriteResource",
  catchAsync(async (req, res) => {
    const user = await User.findById(req.user.user._id);
    if (!user)
      return res.json({
        success: false,
        status: 400,
        message: "Invalid user ID",
        data: null,
      });

    if (user.favouriteResources.includes(req.body.resourceId))
      return res.json({
        success: false,
        status: 400,
        message: "User has already the resource favourited",
        data: null,
      });

    user.favouriteResources.push(req.body.resourceId);
    await user.save();

    res.json({
      success: true,
      status: 200,
      message: "Resource added to user favourites successfully",
      data: null,
    });
  })
);

router.post(
  "/unfavouriteResource",
  catchAsync(async (req, res) => {
    const user = await User.findById(req.user.user._id);
    if (!user)
      return res.json({
        success: false,
        status: 400,
        message: "Invalid user ID",
        data: null,
      });

    user.favouriteResources.pull(req.body.resourceId);
    await user.save();

    res.json({
      success: true,
      status: 200,
      message: "Resource removed from favourites successfully",
      data: null,
    });
  })
);

router.post(
  "/createLibrarian",
  [isLoggedIn, isAdmin],
  catchAsync(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Incorrect email",
        data: null,
      });
    }

    user.isLibrarian = true;
    const newUser = await user.save();

    res.json({
      success: true,
      status: 200,
      message: "Librarian added successfully",
      data: {
        email: newUser.email,
        isLibrarian: newUser.isLibrarian,
        name: newUser.name,
        phoneNumber: newUser.phoneNumber,
      },
    });
  })
);

router.delete(
  "/deleteLibrarian",
  [isLoggedIn, isAdmin],
  catchAsync(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Incorrect email",
        data: null,
      });
    }

    user.isLibrarian = false;
    const newUser = await user.save();

    res.status(200).json({
      success: true,
      status: 200,
      message: "Librarian removed successfully",
      data: {
        email: newUser.email,
        isLibrarian: newUser.isLibrarian,
        name: newUser.name,
        phoneNumber: newUser.phoneNumber,
      },
    });
  })
);

router.get(
  "/getLibrarians",
  [isLoggedIn, isAdmin],
  catchAsync(async (req, res) => {
    const librarians = await User.find({ isLibrarian: true });
    if (librarians.length === 0) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "No librarian found",
        data: null,
      });
    }
    return res.status(200).json({
      success: true,
      status: 200,
      message: "librarian found successfully",
      data: librarians,
    });
  })
);

router.get("/getHistory", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.user.user._id);
    if (!user)
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Incorrect user id",
        data: null,
      });

    const { bookHistory } = user;
    const books = await Promise.all(
      bookHistory.map(async (bookId) => {
        const book = await Book.findById(bookId);
        return book; // Return the book object
      })
    );

    if (!books)
      return res.status(400).json({
        success: false,
        status: 400,
        message: "No books found",
        data: null,
      });

    res.status(200).json({
      success: true,
      status: 200,
      message: "Books fetched successfully",
      data: books,
    });
  } catch (e) {
    console.log(e);
  }
});

router.post(
  "/bookmarkBook",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { bookId } = req.body; // Take bookId from req.body
    const user = await User.findById(req.user.user._id);

    if (!user.bookmarkedBooks.includes(bookId)) {
      user.bookmarkedBooks.push(bookId);
      await user.save();
      return res.status(200).json({
        success: true,
        status: 200,
        message: "Book bookmarked successfully",
      });
    }

    return res.status(400).json({
      success: false,
      status: 400,
      message: "Book already bookmarked",
    });
  })
);
router.post(
  "/unbookmarkBook",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { bookId } = req.body; // Take bookId from req.body
    const user = await User.findById(req.user.user._id);

    if (user.bookmarkedBooks.includes(bookId)) {
      user.bookmarkedBooks = user.bookmarkedBooks.filter(
        (id) => id.toString() !== bookId
      );
      await user.save();
      return res.status(200).json({
        success: true,
        status: 200,
        message: "Book unbookmarked successfully",
      });
    }

    return res.status(400).json({
      success: false,
      status: 400,
      message: "Book not bookmarked",
    });
  })
);
router.get(
  "/getBookmarkedBooks",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const user = await User.findById(req.user.user._id).populate(
      "bookmarkedBooks"
    );

    if (!user.bookmarkedBooks || user.bookmarkedBooks.length === 0) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "No bookmarked books found",
      });
    }

    res.status(200).json({
      success: true,
      status: 200,
      message: "Bookmarked books fetched successfully",
      data: user.bookmarkedBooks,
    });
  })
);

router.get(
  "/getFavouriteResources",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const user = await User.findById(req.user.user._id).populate(
      "favouriteResources"
    );

    if (
      !user ||
      !user.favouriteResources ||
      user.favouriteResources.length === 0
    ) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "No favourite resources found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      status: 200,
      message: "Favourite resources fetched successfully",
      data: user.favouriteResources,
    });
  })
);

module.exports = router;
