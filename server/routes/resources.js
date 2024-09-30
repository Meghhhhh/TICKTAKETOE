const express = require("express");
const router = express.Router();
const { initializeApp } = require("firebase/app");
const { firebaseConfig } = require("../config/firebase.config");
const loggedIn = require("../middleware/isLoggedIn.js");
const isAdmin = require("../middleware/isAdmin");
const User = require("../models/user.js");

const {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} = require("firebase/storage");
const multer = require("multer");
const catchAsync = require("../utils/asyncMiddleware.js");
const Resources = require("../models/resources.js");
const Users = require("../models/user.js");
const Joi = require("joi");
const isLoggedIn = require("../middleware/isLoggedIn.js");
const asyncMiddleware = require("../utils/asyncMiddleware.js");
const user = require("../models/user.js");

initializeApp(firebaseConfig);
const storage = getStorage();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/getResources",
  catchAsync(async (req, res) => {
    const { id, userId } = req.body;

    if (id) {
      const resource = await Resources.findById(id).populate("userId");
      if (!resource)
        return res.json({
          success: false,
          status: 400,
          message: "Invalid Resource ID",
          data: null,
        });

      return res.json({
        success: true,
        status: 200,
        message: "Resource retrieved successfully",
        data: resource,
      });
    } else if (userId) {
      const resources = await Resources.find({ userId })
        .sort({ createdAt: -1 })
        .populate("userId");
      return res.json({
        success: true,
        status: 200,
        message: "Resources retrieved successfully",
        data: resources,
      });
    } else {
      const resources = await Resources.find()
        .sort({ createdAt: -1 })
        .populate("userId");
      return res.json({
        success: true,
        status: 200,
        message: "Resources retrieved successfully",
        data: resources,
      });
    }
  })
);
router.post(
  "/getMyResources",
  catchAsync(async (req, res) => {
    const userId = req.user.user._id;

    if (!userId) {
      return res.json({
        success: false,
        status: 400,
        message: "Login first",
        data: null,
      });
    }
    const resources = await Resources.find({ userId })
      .sort({ createdAt: -1 })
      .populate("userId");
    return res.json({
      success: true,
      status: 200,
      message: "Resources retrieved successfully",
      data: resources,
    });
  })
);

router.post(
  "/searchResources",
  catchAsync(async (req, res) => {
    const query = req.body.keyword;

    // Search for resources and populate the user's name field from the User model
    const resources = await Resources.find({
      title: { $regex: query, $options: "i" },
    }).populate({
      path: "userId", // Path to populate userId
      select: "name", // Only fetch the user's name
    });

    if (resources.length === 0)
      return res.json({
        success: false,
        status: 404,
        message: "No resource found with the given input",
        data: null,
      });

    res.json({
      success: true,
      status: 200,
      message: "Resources retrieved successfully",
      data: resources,
    });
  })
);

router.post(
  "/filterResources",
  catchAsync(async (req, res) => {
    const resource = await Resources.find({ category: req.body.category });
    if (resource.length === 0)
      return res.json({
        success: false,
        status: 400,
        message: "Invalid resource type",
        data: null,
      });

    res.json({
      success: true,
      status: 200,
      message: "Resources retrieved successfully",
      data: resource,
    });
  })
);

router.post(
  "/postResource",
  // isLoggedIn,
  upload.fields([{ name: "thumbnail" }, { name: "file" }]), // Allow multiple fields
  asyncMiddleware(async (req, res) => {
    const { title, category, description, userId, tags, link } = req.body;

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.json({
        success: false,
        status: 404,
        message: "User not found",
        data: null,
      });
    }

    if (category === "link") {

      
      if (!link) {
        return res.json({
          success: false,
          status: 400,
          message: "Link is required for category 'link'",
          data: null,
        });
      }

      const thumbnail = req.files.thumbnail ? req.files.thumbnail[0] : null;

      if (!thumbnail) {
        return res.json({
          success: false,
          status: 400,
          message: "No thumbnail uploaded",
          data: null,
        });
      }


      const thumbnailName = `${Date.now()}_thumbnail_${thumbnail.originalname}`;
      const thumbnailRef = ref(storage, `resources/${thumbnailName}`);

      
      const thumbnailMetadata = {
        contentType: thumbnail.mimetype,
      };
      const thumbnailUploadTask = await uploadBytesResumable(
        thumbnailRef,
        thumbnail.buffer,
        thumbnailMetadata
      );

      
      const thumbnailDownloadURL = await getDownloadURL(
        thumbnailUploadTask.ref
      );


      const resource = new Resources({
        title,
        link,
        category,
        description,
        thumbnail: thumbnailDownloadURL,
        thumbnailName,
        userId,
        tags,
      });
      await resource.save();

      
      return res.json({
        success: true,
        status: 200,
        message: "Resource posted successfully",
        data: resource,
      });
    } else {
      const file = req.files.file ? req.files.file[0] : null; // Accessing the uploaded file
      const thumbnail = req.files.thumbnail ? req.files.thumbnail[0] : null; // Accessing the uploaded thumbnail

      if (!file) {
        return res.json({
          success: false,
          status: 400,
          message: "No file uploaded",
          data: null,
        });
      }

      if (!thumbnail) {
        return res.json({
          success: false,
          status: 400,
          message: "No thumbnail uploaded",
          data: null,
        });
      }

      const fileName = `${Date.now()}_${file.originalname}`;
      const thumbnailName = `${Date.now()}_thumbnail_${thumbnail.originalname}`;

      const storageRef = ref(storage, `resources/${fileName}`);
      const thumbnailRef = ref(storage, `resources/${thumbnailName}`);

      const metadata = {
        contentType: file.mimetype,
      };

      // Upload the main file
      const uploadTask = await uploadBytesResumable(
        storageRef,
        file.buffer,
        metadata
      );
      const downloadURL = await getDownloadURL(uploadTask.ref);

      // Upload the thumbnail
      const thumbnailMetadata = {
        contentType: thumbnail.mimetype,
      };
      const thumbnailUploadTask = await uploadBytesResumable(
        thumbnailRef,
        thumbnail.buffer,
        thumbnailMetadata
      );
      const thumbnailDownloadURL = await getDownloadURL(
        thumbnailUploadTask.ref
      );

      const resource = new Resources({
        fileName,
        title,
        link: downloadURL,
        thumbnail: thumbnailDownloadURL, // Save the thumbnail URL
        thumbnailName,
        category,
        description,
        userId,
        tags,
      });
      await resource.save();
      return res.json({
        success: true,
        status: 200,
        message: "Resource posted successfully",
        data: resource,
      });
    }
  })
);

router.put(
  "/updateResource",
  upload.fields([
    { name: "thumbnail", optional: true },
    { name: "file", optional: true },
  ]), // Optional file fields
  catchAsync(async (req, res) => {
    const { title, category, description } = req.body;
    const updates = { title, category, description };

    if (category === "link") {
      updates.link = req.body.link; // Always include link for links
    } else {
      // Handle file uploads
      if (req.files.file && req.files.file.length > 0) {
        const file = req.files.file[0];
        const fileName = `${Date.now()}_${file.originalname}`;
        const storageRef = ref(storage, `resources/${fileName}`);
        const metadata = {
          contentType: file.mimetype,
        };
        const uploadTask = await uploadBytesResumable(
          storageRef,
          file.buffer,
          metadata
        );
        updates.link = await getDownloadURL(uploadTask.ref); // Update the link with the new file URL
        updates.fileName = fileName; // Update the filename
      }

      if (req.files.thumbnail && req.files.thumbnail.length > 0) {
        const thumbnail = req.files.thumbnail[0];
        const thumbnailName = `${Date.now()}_thumbnail_${
          thumbnail.originalname
        }`;
        const thumbnailRef = ref(storage, `resources/${thumbnailName}`);
        const thumbnailMetadata = {
          contentType: thumbnail.mimetype,
        };
        const thumbnailUploadTask = await uploadBytesResumable(
          thumbnailRef,
          thumbnail.buffer,
          thumbnailMetadata
        );
        updates.thumbnail = await getDownloadURL(thumbnailUploadTask.ref); // Update the thumbnail URL
        updates.thumbnailName = thumbnailName; // Update the thumbnail name
      }
    }

    const updatedResource = await Resources.findByIdAndUpdate(
      req.body.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedResource) {
      return res.json({
        success: false,
        status: 404,
        message: "Resource not found",
        data: null,
      });
    }

    res.json({
      success: true,
      status: 200,
      message: "Resource updated successfully",
      data: updatedResource,
    });
  })
);

router.delete(
  "/deleteResource",
  catchAsync(async (req, res) => {
    const { id } = req.body;

    const resource = await Resources.findById(id);
    if (!resource) {
      return res.json({
        success: false,
        status: 404,
        message: "Resource not found",
        data: null,
      });
    }

    if (resource.category === "link") {
      const deletedResource = await Resources.findByIdAndDelete(id);
      return res.json({
        success: true,
        status: 200,
        message: "Resource deleted successfully",
        data: deletedResource,
      });
    } else {
      try {
        // Delete the file if it exists
        if (resource.fileName) {
          const fileRef = ref(storage, `resources/${resource.fileName}`);
          await deleteObject(fileRef);
        }

        // Delete the thumbnail if it exists
        if (resource.thumbnailName) {
          const thumbnailRef = ref(
            storage,
            `resources/${resource.thumbnailName}`
          );
          await deleteObject(thumbnailRef);
        }

        const deletedResource = await Resources.findByIdAndDelete(id);
        return res.json({
          success: true,
          status: 200,
          message: "Resource deleted successfully",
          data: deletedResource,
        });
      } catch (error) {
        return res.json({
          success: false,
          status: 400,
          message: error.message || "Error deleting resources",
          data: null,
        });
      }
    }
  })
);

router.post(
  "/rateResource",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { resourceId, rating } = req.body;
    const userId = req.user._id;

    if (rating < 1 || rating > 5) {
      return res.json({
        success: false,
        status: 400,
        message: "Rating must be between 1 and 5",
      });
    }

    const resource = await Resources.findById(resourceId);
    if (!resource) {
      return res.json({
        success: false,
        status: 404,
        message: "Resource not found",
      });
    }

    // Check if the user has already rated
    const existingRatingIndex = resource.ratings.findIndex(
      (r) => r.userId.toString() === userId.toString()
    );

    if (existingRatingIndex !== -1) {
      // Update existing rating
      resource.ratings[existingRatingIndex].rating = rating;
    } else {
      // Add new rating
      resource.ratings.push({ userId, rating });
    }

    await resource.save();
    res.json({
      success: true,
      status: 200,
      message: "Resource rated successfully",
      data: resource,
    });
  })
);

// Content-Based Recommendation
router.post(
  "/recommendResourcesByContent",
  catchAsync(async (req, res) => {
    const { resourceId } = req.body;

    const resource = await Resources.findById(resourceId);
    if (!resource) {
      return res.json({
        success: false,
        status: 404,
        message: "Resource not found",
      });
    }

    // Find similar resources by category and tags
    let recommendedResources = await Resources.find({
      _id: { $ne: resourceId }, // Exclude the original resource
      category: resource.category,
      tags: { $in: resource.tags },
    })
      .limit(10) // Limit results for simplicity
      .populate({
        path: "userId", // Populate userId with name
        select: "name",
      });

    // If no similar resources found, return random resources
    if (recommendedResources.length === 0) {
      recommendedResources = await Resources.aggregate([
        { $sample: { size: 10 } },
      ]).exec();

      return res.json({
        success: true,
        status: 200,
        message: "No similar resources found, showing random resources",
        data: recommendedResources,
      });
    }

    res.json({
      success: true,
      status: 200,
      message: "Similar resources recommended",
      data: recommendedResources,
    });
  })
);

// Collaborative Filtering Recommendation
router.post(
  "/recommendResourcesByCollaborativeFiltering",
  // isLoggedIn,
  catchAsync(async (req, res) => {
    const userId = req.user._id;

    // Get resources rated/bookmarked by the current user
    const userInteractions = await Resources.find({
      $or: [{ ratings: { $elemMatch: { userId } } }, { bookmarkedBy: userId }],
    }).populate({
      path: "userId", // Populate userId with name
      select: "name",
    });


    // If no interactions are found, return random resources
    if (userInteractions.length === 0) {
      const randomResources = await Resources.aggregate([
        { $sample: { size: 10 } },
      ]).exec();

      return res.json({
        success: true,
        status: 200,
        message: "No interactions found, showing random resources",
        data: randomResources,
      });
    }

    // Extract categories and tags of interacted resources
    const categories = userInteractions.map((r) => r.category);
    const tags = userInteractions.flatMap((r) => r.tags);

    // Find resources rated/bookmarked by other users with similar interactions
    let recommendedResources = await Resources.find({
      $and: [
        { _id: { $nin: userInteractions.map((r) => r._id) } }, // Exclude already interacted resources
        {
          $or: [
            { category: { $in: categories } },
            { tags: { $in: tags } },
            { ratings: { $elemMatch: { userId: { $ne: userId } } } },
          ],
        },
      ],
    })
      .limit(10)
      .populate({
        path: "userId", // Populate userId with name
        select: "name",
      });

    // If no recommended resources, return random resources
    if (recommendedResources.length === 0) {
      recommendedResources = await Resources.aggregate([
        { $sample: { size: 10 } },
      ]).exec();

      return res.json({
        success: true,
        status: 200,
        message: "No recommendations available, showing random resources",
        data: recommendedResources,
      });
    }


    res.json({
      success: true,
      status: 200,
      message: "Resources recommended successfully",
      data: recommendedResources,
    });
  })
);

// Bookmark a resource
router.post(
  "/bookmarkResource",
  catchAsync(async (req, res) => {
    const { userId, resourceId } = req.body;

    // Validate resource existence
    const resource = await Resources.findById(resourceId);
    if (!resource) {
      return res.json({
        success: false,
        status: 404,
        message: "Resource not found",
      });
    }

    // Update user's favouriteResources
    const user = await User.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        status: 404,
        message: "User not found",
      });
    }

    if (user.favouriteResources.includes(resourceId)) {
      return res.json({
        success: false,
        status: 400,
        message: "Resource already bookmarked",
      });
    }

    user.favouriteResources.push(resourceId);
    await user.save();

    return res.json({
      success: true,
      status: 200,
      message: "Resource bookmarked successfully",
      data: user.favouriteResources,
    });
  })
);

// Unbookmark a resource
router.post(
  "/unbookmarkResource",
  catchAsync(async (req, res) => {
    const { userId, resourceId } = req.body;

    // Validate resource existence
    const resource = await Resources.findById(resourceId);
    if (!resource) {
      return res.json({
        success: false,
        status: 404,
        message: "Resource not found",
      });
    }

    // Update user's favouriteResources
    const user = await User.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        status: 404,
        message: "User not found",
      });
    }

    if (!user.favouriteResources.includes(resourceId)) {
      return res.json({
        success: false,
        status: 400,
        message: "Resource not bookmarked",
      });
    }

    user.favouriteResources = user.favouriteResources.filter(
      (favResourceId) => favResourceId.toString() !== resourceId.toString()
    );
    await user.save();

    return res.json({
      success: true,
      status: 200,
      message: "Resource unbookmarked successfully",
      data: user.favouriteResources,
    });
  })
);

module.exports = router;
