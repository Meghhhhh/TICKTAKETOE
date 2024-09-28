const mongoose = require("mongoose");

const Resources = mongoose.model(
  "Resources",
  new mongoose.Schema(
    {
      fileName: { type: String},
      title: { type: String, required: true },
      link: { type: String },
      category: {
        type: String,
        required: true,
        enum: ["text", "pdf", "word", "image", "video", "other", "link"] ,
      },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      description: { type: String },
      thumbnail: { type: String },
      thumbnailName: { type: String },
       createdAt: {
        type: Date,
        default: Date.now,
      },
    }
    // { timestamps: true }
  )
);

module.exports = Resources;
