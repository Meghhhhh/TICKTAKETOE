const mongoose = require("mongoose");

const Restaurantschema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  area: {
    type: String,
    required: true,
    enum: ["akota", "gotri", "fateganj", "shubhanpura", "sevasi", "bhayali"],
  },
  number: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return v.toString().length === 10;
      },
      message: (props) =>
        `${props.value} is not a valid contact number! It should be 10 digits long.`,
    },
  },
  email: { type: String, unique: true, required: true },
  image: { type: String, required: true },
  location: { type: String, required: true },
  imageFileName: { type: String, required: false },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Restaurants = mongoose.model("Restaurants", Restaurantschema);

module.exports = Restaurants;
