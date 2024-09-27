const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/asyncMiddleware");
const Report = require("../models/report");
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
const upload = multer({ storage: multer.memoryStorage() });

// Get all reports or reports for a specific user
router.get(
  "/getReports",
  catchAsync(async (req, res) => {
    let reports;

    if (req.body.userId) {
      reports = await Report.find({ userId: req.body.userId }).populate(
        "userId"
      );
      if (reports.length === 0) {
        return res.json({
          success: false,
          status: 400,
          message: "No reports found for this user",
          data: null,
        });
      }
    } else {
      reports = await Report.find().populate("userId");
    }

    res.json({
      success: true,
      status: 200,
      message: "Reports retrieved successfully",
      data: reports,
    });
  })
);

// Create a new report with a prescription photo
router.post(
  "/createReport",
  upload.single("prescriptionImage"), // Upload prescription image using multer
  catchAsync(async (req, res) => {
    try {
      const schema = Joi.object({
        doctorName: Joi.string().required(),
        userId: Joi.string().required(),
        prescribedMedicines: Joi.array()
          .items(
            Joi.object({
              name: Joi.string().required(),
              dosage: Joi.string().required(),
              frequency: Joi.string().required(),
            })
          )
          .required(),
        diagnosis: Joi.string().required(),
        notes: Joi.string().optional(),
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

      let prescriptionImageURL = "";
      let fileName = "";

      // Check if a prescription image is uploaded
      const file = req.file;
      if (file) {
        fileName = `${Date.now()}_${file.originalname}`;
        const storageRef = ref(storage, `prescriptions/${fileName}`);
        const metadata = { contentType: file.mimetype };
        const uploadTask = await uploadBytesResumable(
          storageRef,
          file.buffer,
          metadata
        );
        prescriptionImageURL = await getDownloadURL(uploadTask.ref);
      }

      const report = new Report({
        doctorName: req.body.doctorName,
        userId: req.body.userId,
        prescribedMedicines: req.body.prescribedMedicines,
        diagnosis: req.body.diagnosis,
        notes: req.body.notes,
        prescriptionImage: prescriptionImageURL, // Add prescription image URL to the report
        prescriptionFileName: fileName, // Store the file name for future reference
      });

      await report.save();
      res.json({
        success: true,
        status: 200,
        message: "Report created successfully",
        data: report,
      });
    } catch (error) {
      console.error("Error in /createReport:", error);
      res.status(500).json({
        success: false,
        status: 500,
        message: "Server error",
        data: null,
      });
    }
  })
);

// Update an existing report and handle prescription photo updates
router.put(
  "/updateReport",
  upload.single("prescriptionImage"), // Handle new prescription image if updated
  catchAsync(async (req, res) => {
    const schema = Joi.object({
      id: Joi.string().required(),
      doctorName: Joi.string().optional(),
      prescribedMedicines: Joi.array()
        .items(
          Joi.object({
            name: Joi.string().optional(),
            dosage: Joi.string().optional(),
            frequency: Joi.string().optional(),
          })
        )
        .optional(),
      diagnosis: Joi.string().optional(),
      notes: Joi.string().optional(),
    });

    const { error } = schema.validate(req.body);
    if (error)
      return res.json({
        success: false,
        status: 400,
        message: error.details[0].message,
        data: null,
      });

    const report = await Report.findById(req.body.id);
    if (!report)
      return res.json({
        success: false,
        status: 400,
        message: "Invalid report ID",
        data: null,
      });

    // Handle prescription image update
    if (req.file) {
      if (report.prescriptionFileName) {
        const desertRef = ref(
          storage,
          `prescriptions/${report.prescriptionFileName}`
        );
        await deleteObject(desertRef); // Delete the old image from Firebase storage
      }

      const file = req.file;
      const fileName = `${Date.now()}_${file.originalname}`;
      const storageRef = ref(storage, `prescriptions/${fileName}`);
      const metadata = {
        contentType: file.mimetype,
      };
      const uploadTask = await uploadBytesResumable(
        storageRef,
        file.buffer,
        metadata
      );
      const downloadURL = await getDownloadURL(uploadTask.ref);

      report.prescriptionImage = downloadURL;
      report.prescriptionFileName = fileName;
    }

    if (req.body.doctorName) report.doctorName = req.body.doctorName;
    if (req.body.prescribedMedicines)
      report.prescribedMedicines = req.body.prescribedMedicines;
    if (req.body.diagnosis) report.diagnosis = req.body.diagnosis;
    if (req.body.notes) report.notes = req.body.notes;

    await report.save();

    res.json({
      success: true,
      status: 200,
      message: "Report updated successfully",
      data: report,
    });
  })
);

// Delete a report and its associated prescription image
router.delete(
  "/deleteReport",
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

    const report = await Report.findById(req.body.id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
        data: null,
      });
    }

    // Delete the associated prescription image from Firebase if it exists
    if (report.prescriptionFileName) {
      const imageRef = ref(
        storage,
        `prescriptions/${report.prescriptionFileName}`
      );
      try {
        await deleteObject(imageRef);
      } catch (err) {
        return res.status(500).json({
          success: false,
          message: "Failed to delete the prescription image from Firebase",
          error: err.message,
        });
      }
    }

    const deletedReport = await Report.findByIdAndDelete(req.body.id);

    res.status(200).json({
      success: true,
      message: "Report deleted successfully",
      data: deletedReport,
    });
  })
);

module.exports = router;
