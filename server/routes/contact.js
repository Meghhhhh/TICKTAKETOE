require("dotenv").config(); // Load environment variables
const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

router.post("/sendQuery", (req, res) => {
  const { name, email, query } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: `New query from ${name}`,
    text: `You have received a new query:\n\nName: ${name}\nEmail: ${email}\nQuery: ${query}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res
        .status(500)
        .json({ message: "Error sending email", success: false });
    }
    return res
      .status(200)
      .json({
        message: "Your query has been successfully sent!",
        success: true,
      });
  });
});

module.exports = router;
