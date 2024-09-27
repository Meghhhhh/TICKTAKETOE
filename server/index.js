require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const passport = require("./config/passport.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const contact = require("./routes/contact");
const googleAuth = require("./routes/googleAuth");
const localAuth = require("./routes/localAuth");
const users = require("./routes/users");
const restaurants = require("./routes/restaurants");
const report = require("./routes/report");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());



app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
  })
);

app.use(passport.initialize());
app.use(passport.session());


app.get("/", (req, res) => res.send("Hello World!"));
app.use("/contact/api/v1", contact);
app.use("/auth/api/v1/local", localAuth);
app.use("/auth/api/v1/google", googleAuth);
app.use("/users/api/v1", users);
app.use("/restaurant/api/v1",restaurants);
app.use("/report/api/v1",report);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(port, () => console.log(`Listening on port ${port}...`));
  })
  .catch((err) => {
    console.log(err);
  });