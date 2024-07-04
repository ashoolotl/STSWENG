const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "The item must have a owner"],
  },
  service: {
    type: String,
    required: [true, "The review must have a product"],
    uppercase: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  rating: {
    type: Number,
    required: [true, "The item must have a rating"],
  },
  ratingMessage: {
    type: String,
    required: [true, "The item must have a review"],
  },
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
