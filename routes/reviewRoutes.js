const express = require("express");
const authController = require("../controllers/authController");
const reviewController = require("../controllers/reviewController");
const router = express.Router();
router.use(authController.protect);

router.route("/").post(reviewController.createReview).get(reviewController.getReviewForService);
router.route("/:reviewId").patch(reviewController.editReview).delete(reviewController.deleteReview);

module.exports = router;
