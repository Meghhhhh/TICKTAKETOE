const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_CLIENT_SECRET);
const isLoggedIn = require("../middleware/isLoggedIn.js");
const User = require("../models/user.js");
const Lend = require("../models/lending.js");

router.post("/create-checkout-session", [isLoggedIn], async (req, res) => {
  try {
    const { products } = req.body;
    const lineItems = products.map((product) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: product.name,
          images: [product.image],
        },
        unit_amount: product.price * 100,
      },
      quantity: product.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.SERVER_URL}/payment/api/v1/paymentsuccess`,
      cancel_url: `${process.env.SERVER_URL}/payment/api/v1/paymentfailed`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating Stripe Checkout session:", error);
    res.status(500).send("Internal Server Error");
  }
});
router.get("/paymentsuccess", isLoggedIn, async (req, res) => {
  try {
    const userId = req.user.user._id; // Get the user ID from the session

    // Delete all lendings where the user is lendedBy
    const lendingsDeleted = await Lend.deleteMany({ lendedBy: userId });

    console.log(
      `Deleted ${lendingsDeleted.deletedCount} lendings for user ${userId}`
    );

    // Send a success response after performing all operations
    // res.status(200).json({
    //   success: true,
    //   message: "Lending records cleared and user profile updated",
    //   deletedLendingsCount: lendingsDeleted.deletedCount,
    // });
    res.redirect(`${process.env.CLIENT_URL}/paymentsuccess`);
  } catch (error) {
    console.error("Error during payment success processing:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

router.get("/paymentfailed", (req, res) => {
  res.redirect(`${process.env.CLIENT_URL}/paymentfailed`);
});

module.exports = router;
