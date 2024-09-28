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
      const resource = await Resources.findById(id);
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
      const resources = await Resources.find({ userId }).sort({
        createdAt: -1,
      });
      return res.json({
        success: true,
        status: 200,
        message: "Resources retrieved successfully",
        data: resources,
      });
    } else {
      const resources = await Resources.find().sort({ createdAt: -1 });
      return res.json({
        success: true,
        status: 200,
        message: "Resources retrieved successfully",
        data: resources,
      });
    }
  })
);

router.get(
  "/searchResources",
  catchAsync(async (req, res) => {
    const query = req.body.keyword;
    const resources = await Resources.find({
      title: { $regex: query, $options: "i" },
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
  upload.single("file"),
  asyncMiddleware(async (req, res) => {
    const categories = [
      "text",
      "pdf",
      "word",
      "image",
      "video",
      "other",
      "link",
    ];
    const schema = Joi.object({
      title: Joi.string().required(),
      category: Joi.string()
        .valid(...categories)
        .required(),
      description: Joi.string(),
      link: Joi.string().optional(),
      userId: Joi.string(),
    });

    const { error } = schema.validate(req.body);
    if (error)
      return res.json({
        success: false,
        status: 400,
        message: error.details[0].message,
        data: null,
      });

    const { title, category, description, userId } = req.body;

   
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
      const resource = new Resources({
        title,
        link: req.body.link,
        category,
        description,
        userId,
      });
      await resource.save();
      return res.json({
        success: true,
        status: 200,
        message: "Resource posted successfully",
        data: resource,
      });
    } else {
      const file = req.file;
      if (!file) {
        return res.json({
          success: false,
          status: 400,
          message: "No file uploaded",
          data: null,
        });
      }
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
      const downloadURL = await getDownloadURL(uploadTask.ref);

      const resource = new Resources({
        fileName,
        title,
        link: downloadURL,
        category,
        description,
        userId,
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
  isAdmin,
  catchAsync(async (req, res) => {
    const { title, category, description } = req.body;

    if (category === "link") {
      const updatedResource = await Resources.findByIdAndUpdate(
        req.body.id,
        { title, category, description, link: req.body.link },
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
    } else {
      const updatedResource = await Resources.findByIdAndUpdate(
        req.body.id,
        { title, category, description },
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
    }
  })
);

router.delete(
  "/deleteResource",
  isAdmin,
  catchAsync(async (req, res) => {
    // console.log(req.body);
    const { id } = req.body;
    // if (!Array.isArray(ids)) {
    //   return res.json({
    //     success: false,
    //     status: 400,
    //     message: "ids should be an array of resource Ids",
    //     data: null,
    //   });
    // }

    const resources = await Resources.findById(id);
    if (resources.length === 0) {
      return res.json({
        success: false,
        status: 404,
        message: "Resources not found",
        data: null,
      });
    }

    if (resources.category === "link") {
      const deletedResources = await Resources.findByIdAndDelete(id);
      res.json({
        success: true,
        status: 200,
        message: "Resources deleted successfully",
        data: deletedResources,
      });
    } else {
      try {
        const desertRef = ref(storage, `resources/${resources.fileName}`);
        await deleteObject(desertRef);

        const deletedResources = await Resources.findByIdAndDelete(id);
        res.json({
          success: true,
          status: 200,
          message: "Resources deleted successfully",
          data: deletedResources,
        });
      } catch (error) {
        return res.json({
          success: false,
          status: 400,
          message: error._baseMessage,
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

router.post(
  "/bookmarkResource",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { resourceId } = req.body;
    const userId = req.user._id;

    const resource = await Resources.findById(resourceId);
    if (!resource) {
      return res.json({
        success: false,
        status: 404,
        message: "Resource not found",
      });
    }

    const isBookmarked = resource.bookmarkedBy.includes(userId);
    if (isBookmarked) {
      // Remove bookmark
      resource.bookmarkedBy = resource.bookmarkedBy.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // Add bookmark
      resource.bookmarkedBy.push(userId);
    }

    await resource.save();
    res.json({
      success: true,
      status: 200,
      message: `Resource ${
        isBookmarked ? "removed from bookmarks" : "bookmarked"
      } successfully`,
      data: resource,
    });
  })
);

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
    const recommendedResources = await Resources.find({
      _id: { $ne: resourceId }, // Exclude the original resource
      category: resource.category,
      tags: { $in: resource.tags },
    }).limit(10); // Limit results for simplicity

    if (recommendedResources.length === 0) {
      return res.json({
        success: false,
        status: 404,
        message: "No similar resources found",
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

router.post(
  "/recommendResourcesByCollaborativeFiltering",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const userId = req.user._id;

    // Get resources rated/bookmarked by the current user
    const userInteractions = await Resources.find({
      $or: [{ ratings: { $elemMatch: { userId } } }, { bookmarkedBy: userId }],
    });

    if (userInteractions.length === 0) {
      return res.json({
        success: false,
        status: 404,
        message: "No interactions found for this user",
      });
    }

    // Extract categories and tags of interacted resources
    const categories = userInteractions.map((r) => r.category);
    const tags = userInteractions.flatMap((r) => r.tags);

    // Find resources rated/bookmarked by other users with similar interactions
    const recommendedResources = await Resources.find({
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
    }).limit(10);

    if (recommendedResources.length === 0) {
      return res.json({
        success: false,
        status: 404,
        message: "No recommendations available",
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

module.exports = router;
