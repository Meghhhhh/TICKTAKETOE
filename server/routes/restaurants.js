const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/asyncMiddleware");
const Restaurants = require("../models/restaurants");
const Joi = require("joi");

const { initializeApp } = require("firebase/app");
const { firebaseConfig } = require("../config/firebase.config");

initializeApp(firebaseConfig);

const {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} = require("firebase/storage");

const storage = getStorage();

const multer = require("multer");
const isAdmin = require("../middleware/isAdmin");
const upload = multer({ storage: multer.memoryStorage() });

router.get(
  "/getRestaurants",
  catchAsync(async (req, res) => {
    let restaurants;

    if (req.body.userId) {
      restaurants = await Restaurants.find({ userId: req.body.userId });
      if (restaurants.length === 0) {
        return res.json({
          success: false,
          status: 400,
          message: "No restaurants found for this user",
          data: null,
        });
      }
    } else {
      restaurants = await Restaurants.find();
    }

    res.json({
      success: true,
      status: 200,
      message: "Restaurants retrieved successfully",
      data: restaurants,
    });
  })
);

router.post(
  "/createRestaurant",
//   isAdmin,
  upload.single("image"),
  catchAsync(async (req, res) => {
    try {
      const types = [
        "akota",
        "gotri",
        "fateganj",
        "shubhanpura",
        "sevasi",
        "bhayali",
      ];
      const schema = Joi.object({
        name: Joi.string().required(),
        address: Joi.string().required(),
        area: Joi.valid(...types).required(),
        number: Joi.number().required(),
        email: Joi.string().email().required(),
        location: Joi.string().required(),
        userId: Joi.string().required(),
      });

      const { error } = schema.validate(req.body);
      if (error) {
        return res.json({
          success: false,
          status: 400,
          message: error.details[0].message,
          data: null,
        });
      }

      const existingRestaurant = await Restaurants.findOne({
        email: req.body.email,
      });
      if (existingRestaurant) {
        return res.json({
          success: false,
          status: 400,
          message: "Email already exists",
          data: null,
        });
      }

      const file = req.file;
      if (!file) {
        return res.json({
          success: false,
          status: 400,
          message: "No thumbnail uploaded",
          data: null,
        });
      }

      const fileName = `${Date.now()}_${file.originalname}`;
      const storageRef = ref(storage, `restaurant/${fileName}`);
      const metadata = { contentType: file.mimetype };
      const uploadTask = await uploadBytesResumable(
        storageRef,
        file.buffer,
        metadata
      );
      const downloadURL = await getDownloadURL(uploadTask.ref);

      const restaurant = new Restaurants({
        name: req.body.name,
        address: req.body.address,
        area: req.body.area,
        number: req.body.number,
        email: req.body.email,
        location: req.body.location,
        userId: req.body.userId,
        image: downloadURL,
        imageFileName: fileName,
      });

      await restaurant.save();
      res.json({
        success: true,
        status: 200,
        message: "Restaurant created successfully",
        data: restaurant,
      });
    } catch (error) {
      console.error("Error in /createRestaurant:", error);
      res.status(500).json({
        success: false,
        status: 500,
        message: "Server error",
        data: null,
      });
    }
  })
);

router.put(
  "/updateRestaurant",
//   isAdmin,
  upload.single("image"),
  catchAsync(async (req, res) => {
    const types = [
      "akota",
      "gotri",
      "fateganj",
      "shubhanpura",
      "sevasi",
      "bhayali",
    ];

    const schema = Joi.object({
      id: Joi.string().required(),
      name: Joi.string().optional(),
      address: Joi.string().optional(),
      area: Joi.valid(...types).optional(),
      number: Joi.number().optional(),
      email: Joi.string().email().optional(),
      location: Joi.string().optional(),
      userId: Joi.string().optional(),
    });

    const { error } = schema.validate(req.body);
    if (error)
      return res.json({
        success: false,
        status: 400,
        message: error.details[0].message,
        data: null,
      });

    const restaurant = await Restaurants.findById(req.body.id);
    if (!restaurant)
      return res.json({
        success: false,
        status: 400,
        message: "Invalid restaurant ID",
        data: null,
      });

    if (req.body.email) {
      const existingRestaurant = await Restaurants.findOne({
        email: req.body.email,
      });
      if (
        existingRestaurant &&
        existingRestaurant._id.toString() !== req.body.id
      )
        return res.json({
          success: false,
          status: 400,
          message: "Email already exists",
          data: null,
        });
    }

    if (req.file) {
      if (restaurant.imageFileName) {
        const desertRef = ref(
          storage,
          `restaurant/${restaurant.imageFileName}`
        );
        await deleteObject(desertRef);
      }

      const file = req.file;
      const fileName = `${Date.now()}_${file.originalname}`;
      const storageRef = ref(storage, `restaurant/${fileName}`);
      const metadata = {
        contentType: file.mimetype,
      };
      const uploadTask = await uploadBytesResumable(
        storageRef,
        file.buffer,
        metadata
      );
      const downloadURL = await getDownloadURL(uploadTask.ref);

      restaurant.image = downloadURL;
      restaurant.imageFileName = fileName;
    }

    if (req.body.name) restaurant.name = req.body.name;
    if (req.body.address) restaurant.address = req.body.address;
    if (req.body.area) restaurant.area = req.body.area;
    if (req.body.number) restaurant.number = req.body.number;
    if (req.body.email) restaurant.email = req.body.email;
    if (req.body.location) restaurant.location = req.body.location;
    if (req.body.userId) restaurant.userId = req.body.userId;

    await restaurant.save();

    res.json({
      success: true,
      status: 200,
      message: "Restaurant updated successfully",
      data: restaurant,
    });
  })
);

router.delete(
  "/deleteRestaurant",
//   isAdmin,
  catchAsync(async (req, res) => {
    const schema = Joi.object({
      id: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
        data: null,
      });
    }

    const restaurant = await Restaurants.findById(req.body.id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
        data: null,
      });
    }


    if (restaurant.imageFileName) {
      const imageRef = ref(storage, `restaurant/${restaurant.imageFileName}`);
      try {
        await deleteObject(imageRef);
      } catch (err) {
        return res.status(500).json({
          success: false,
          message: "Failed to delete the restaurant image from Firebase",
          error: err.message,
        });
      }
    }

    const deletedRestaurant = await Restaurants.findByIdAndDelete(req.body.id);

    res.status(200).json({
      success: true,
      message: "Restaurant and associated workers deleted successfully",
      data: deletedRestaurant,
    });
  })
);

module.exports = router;
