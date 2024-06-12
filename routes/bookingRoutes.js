const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');
const router = express.Router();
router.use(authController.protect);

router.get(
    '/checkout-session/:userId',
    authController.protect,
    bookingController.getCheckoutSession
);
router.get(
    '/',
    authController.restrictTo('admin'),
    bookingController.getAllBookings
);
router.patch(
    '/:bookingId',
    authController.protect,
    bookingController.updateBookingStatus
);
// this is for the subscription
router.post(
    '/checkout-subscription/:userId',
    bookingController.createCheckoutSessionSubscription
);
router.get(
    '/:ownerId',
    authController.protect,
    authController.restrictTo('admin'),
    bookingController.getBookingByOwner
);
module.exports = router;
