const mongoose = require("mongoose");

const Resources = mongoose.model(
  "Resources",
  new mongoose.Schema({
    fileName: { type: String },
    title: { type: String, required: true },
    link: { type: String },
    category: {
      type: String,
      required: true,
      enum: ["text", "pdf", "word", "image", "video", "other", "link"],
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    description: { type: String },
    tags: [{ type: String }], // Optional: Add tags for content-based recommendations
    ratings: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
      },
    ],
    thumbnail: { type: String },
    thumbnailName: { type: String },
    createdAt: {
      type: Date,
      default: Date.now,
    },

    // { timestamps: true }

    bookmarkedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  })
);

module.exports = Resources;
