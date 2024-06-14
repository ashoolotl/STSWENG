const catchAsync = require('../utils/catchAsync');
const BookingSubscription = require('../models/bookingSubscriptionModel');
exports.getAllBookingSubscription = catchAsync(async (req, res, next) => {});

exports.getSubscriptionBookingById = catchAsync(async (req, res, next) => {
    const subscriptionBooking = await BookingSubscription.findByIdAndUpdate(
        req.params.subscriptionBookingId
    );
    res.status(200).json({
        status: 'success',
        data: {
            subscriptionBooking,
        },
    });
});
exports.updateSubscriptionTokens = catchAsync(async (req, res, next) => {
    console.log('INSIDE UPDATE BOOKING TOKENS ID');
    console.log(req.body);
    const update = {
        $set: {
            subscriptionDetails: req.body.subscriptionDetails,
        },
    };

    const updatedBooking = await BookingSubscription.findByIdAndUpdate(
        req.params.subscriptionBookingId,
        update,
        {
            new: true,
            runValidators: true,
        }
    );

    console.log('ME IS THE UPDATED VALUES');
    console.log(updatedBooking);
    res.status(200).json({
        status: 'success',
        data: {
            bookingSubscription: updatedBooking,
        },
    });
});
exports.updateBookingSubscriptionById = catchAsync(async (req, res, next) => {
    console.log('INSIDE UPDATE BOOKING SUBSCRIPTIONS ID');
    console.log(req.body);
    const updatedBooking = await BookingSubscription.findByIdAndUpdate(
        req.params.subscriptionBookingId,
        {
            scheduledDate: req.body.scheduledDate,
            status: req.body.status,
            chosenService: req.body.chosenService,
        },
        {
            new: true,
            runValidators: true,
        }
    );
    console.log(updatedBooking);
    res.status(200).json({
        status: 'success',
        data: {
            bookingSubscription: updatedBooking,
        },
    });
});

exports.deductTokensById = catchAsync(async (req, res, next) => {
    console.log('INSIDE BALIKTAD');
    const updatedTokens = await BookingSubscription.findByIdAndUpdate(
        req.params.subscriptionBookingId,
        {
            scheduledDate: req.body.scheduledDate,
            status: req.body.status,
            chosenService: req.body.chosenService,
        },
        {
            new: true,
            runValidators: true,
        }
    );
    res.status(200).json({
        status: 'success',
        data: {
            updatedTokens,
        },
    });
});
