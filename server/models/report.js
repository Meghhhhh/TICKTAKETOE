const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  doctorName: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  prescribedMedicines: [
    {
      name: { type: String, required: true },
      dosage: { type: String, required: true },
      frequency: { type: String, required: true },
    },
  ],
  diagnosis: { type: String, required: true },
  date: { type: Date, default: Date.now },
  notes: { type: String },
  prescriptionImage: { type: String, required: false }, 
  prescriptionFileName: { type: String, required: false }, // Firebase image file name
});

const Report = mongoose.model("Report", ReportSchema);
