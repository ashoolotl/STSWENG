const Service = require("../models/servicesModel");
const Review = require("../models/reviewModel");
const Reply = require("../models/replyModel");

/* exports.getReviewForService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.serviceId);
    const reviews = await Review.find({ service: service.name }).populate({
      path: "user",
      select: "lastName firstName",
    });
    console.log(reviews);
    res.status(200).json({
      status: "success",
      data: {
        reviews,
      },
    });
    c;
  } catch (error) {
    next(error);
  }
}; */

exports.createReview = async (req, res, next) => {
  try {
    const newReview = await Review.create({
      user: req.user.id,
      service: req.body.service,
      rating: req.body.rating,
      ratingMessage: req.body.ratingMessage,
    });
    res.status(201).json({
      status: "success",
      data: {
        review: newReview,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.editReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (review.user.toString() !== req.user.id) {
      return res.status(401).json({
        status: "fail",
        message: "You are not authorized to edit this review",
      });
    }
    review.rating = req.body.rating;
    review.ratingMessage = req.body.ratingMessage;
    await review.save();
    res.status(200).json({
      status: "success",
      data: {
        review,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (review.user.toString() !== req.user.id) {
      return res.status(401).json({
        status: "fail",
        message: "You are not authorized to delete this review",
      });
    }
    await review.remove();
    res.status(200).json({
      status: "success",
      message: "Review deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
