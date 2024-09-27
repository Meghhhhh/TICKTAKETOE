const express = require("express");
const router = express.Router();
const { initializeApp } = require("firebase/app");
const { firebaseConfig } = require("../config/firebase.config");
const loggedIn = require("../middleware/isLoggedIn.js");
const isAdmin = require("../middleware/isAdmin");

router.use(loggedIn);

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

initializeApp(firebaseConfig);
const storage = getStorage();
const upload = multer({ storage: multer.memoryStorage() });

router.get(
  "/getResources",
  catchAsync(async (req, res) => {
    if (!req.body.id) {
      const resources = await Resources.find().sort({ createdAt: -1 });
      res.json({
        success: true,
        status: 200,
        message: "Resources retrieved successfully",
        data: resources,
      });
    } else {
      const resource = await Resources.findById(req.body.id);
      if (!resource)
        return res.json({
          success: false,
          status: 400,
          message: "Invalid Resource ID",
          data: null,
        });

      res.json({
        success: true,
        status: 200,
        message: "Resource retrieved successfully",
        data: resource,
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
  "/favouriteResource",
  catchAsync(async (req, res) => {
    const user = await Users.findById(req.user.user._id);
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
    const user = await Users.findById(req.user.user._id);
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
  "/getFavourites",
  catchAsync(async (req, res) => {
    const user = await Users.findById(req.user.user._id).populate(
      "favouriteResources",
      "fileName title description category link"
    );
    if (!user)
      return res.json({
        success: false,
        status: 404,
        message: "No user found",
        data: null,
      });

    const userFavourites = user.favouriteResources;
    res.json({
      success: true,
      status: 200,
      message: "User favourites retrieved successfully",
      data: userFavourites,
    });
  })
);

//ADMIN PROTECTED
router.post(
  "/postResource",
  isAdmin,
  upload.single("file"),
  catchAsync(async (req, res) => {
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
      link: Joi.string(),
    });

    const { error } = schema.validate(req.body);
    if (error)
      return res.json({
        success: false,
        status: 400,
        message: error.details[0].message,
        data: null,
      });

    const { title, category, description } = req.body;
    if (category === "link") {
      const resource = new Resources({
        title,
        link: req.body.link,
        category,
        description,
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

module.exports = router;
