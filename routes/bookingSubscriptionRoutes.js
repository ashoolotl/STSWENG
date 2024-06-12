const express = require('express');
const bookingSubscriptionController = require('../controllers/bookingSubscriptionController');
const authController = require('../controllers/authController');
const router = express.Router();
router.use(authController.protect);

router.route('/').get(bookingSubscriptionController.getAllBookingSubscription);

router
    .route('/:subscriptionBookingId')
    .get(bookingSubscriptionController.getSubscriptionBookingById)
    .patch(bookingSubscriptionController.deductTokensById);

router
    .route('/token/:subscriptionBookingId')
    .patch(bookingSubscriptionController.updateSubscriptionTokens);
module.exports = router;
