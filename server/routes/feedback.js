const express = require("express");
const router = express.Router();
const Feedback = require("../models/feedback.js");
const catchAsync = require("../utils/asyncMiddleware.js");
const isLoggedIn = require("../middleware/isLoggedIn.js");

router.get(
    "/getFeedbacks",
    catchAsync(async (req, res) => {
      // Find all feedbacks and populate the userId field with user data
      const feedbacks = await Feedback.find().populate("userId", "name email"); // Assuming the Users model has fields 'name' and 'email'
  
      if (feedbacks.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No feedbacks found",
          data: null,
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Feedbacks retrieved successfully",
        data: feedbacks,
      });
    })
  );

router.post(
    "/postFeedback",
    isLoggedIn,
    catchAsync(async (req, res) => {
      const { bookName, feedback, rating } = req.body;
      const userId = req.user.user._id; 
  
      if (!bookName || !rating) {
        return res.status(400).json({ success: false, message: "Book name and rating are required" });
      }
  
      // Create new feedback
      const newFeedback = new Feedback({
        userId,
        bookName,
        feedback,
        rating,
      });
  
      await newFeedback.save(); // Save feedback to database
  
      return res.status(201).json({
        success: true,
        message: "Feedback successfully posted",
        data: newFeedback,
      });
    })
  );

module.exports = router;

