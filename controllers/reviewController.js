const Service = require("../models/servicesModel");
const Review = require("../models/reviewModel");
const Reply = require("../models/replyModel");

exports.getReviewForService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.serviceId);
    const reviews = await Review.find({ service: service.name }).populate({
      path: "user",
      select: "lastName firstName",
    });

    res.status(200).json({
      status: "success",
      data: {
        reviews,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching reviews.",
    });
  }
};

exports.createReview = async (req, res, next) => {
  try {
    const existingReview = await Review.findOne({
      user: req.user.id,
      service: req.body.service,
    });

    if (existingReview) {
      return res.status(409).json({
        status: "fail",
        message: "You have already reviewed this service.",
      });
    }

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
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while posting the review.",
    });
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
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while editing the review.",
    });
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

    await review.deleteReview();
    res.status(200).json({
      status: "success",
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while deleting the review.",
    });
  }
};

exports.replyToReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    const newReply = await Reply.create({
      user: req.user.id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      review: req.params.reviewId,
      replyMessage: req.body["reply-text"],
    });

    review.replies.push(newReply);
    await review.save();
    res.status(200).json({
      status: "success",
      data: {
        reply: newReply,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while replying to the review.",
    });
  }
};
