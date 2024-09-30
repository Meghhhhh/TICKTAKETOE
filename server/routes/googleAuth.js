const express = require("express");
const router = express.Router();
const passport = require("passport");
const isLoggedIn = require("../middleware/isLoggedIn.js");

router.get(
  "/register",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/register/callback",
  passport.authenticate("google", {
    session: true,
    // successRedirect: `${process.env.CLIENT_URL}/`,
    failureRedirect: `${process.env.CLIENT_URL}/auth/login`,
  }),
  (req, res) => {
    // console.log(req.user);
    // const { email, name, profilePicture, _id, isAdmin, authId } = req.user.user;
    if (req.user.user) {
      res.redirect(`${process.env.CLIENT_URL}`);
      // return res.json({
      //   success: true,
      //   status: 200,
      //   message: "User registered successfully",
      //   data: { _id, email, profilePicture, name, isAdmin, authId },
      // });
    }else{
      res.redirect(`${process.env.CLIENT_URL}/auth/login`);
    }
  }
);

router.post("/logout", isLoggedIn, (req, res, next) => {
  if (req.user && req.user.accessToken) {
    const token = req.user.accessToken;
    fetch(`https://oauth2.googleapis.com/revoke?token=${token}`, {
      method: "POST",
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => response.json())
      .catch((err) => {
        console.error("Error revoking token:", err);
      });
  }

  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((error) => {
      if (error) {
        return next(error);
      }

      res.clearCookie("connect.sid");

      res.json({
        success: true,
        status: 200,
        message: "Logged out successfully",
        data: null,
      });
    });
  });
});

module.exports = router;
