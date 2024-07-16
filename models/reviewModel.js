const mongoose = require("mongoose");

function getCurrentDateString() {
  const date = new Date();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

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
    type: String,
    default: getCurrentDateString,
  },
  rating: {
    type: Number,
    required: [true, "The item must have a rating"],
  },
  ratingMessage: {
    type: String,
    required: [true, "The item must have a review"],
  },
  replies: {
    type: Array,
    default: [],
  },
});

reviewSchema.methods.deleteReview = async function () {
  await this.model("Review").findByIdAndDelete(this._id);
};

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
