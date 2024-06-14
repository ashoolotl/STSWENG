const SubscriptionAvailed = require('../models/subscriptionAvailedModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllSubscriptionsAvailed = catchAsync(async (req, res, next) => {
    const subscriptionsAvailed = await SubscriptionAvailed.find();

    res.status(200).json({
        status: 'success',
        data: {
            subscriptionsAvailed,
        },
    });
});
exports.getAvailedSubscriptionById = catchAsync(async (req, res, next) => {
    const subscriptionUserAvailed = await SubscriptionAvailed.findById(
        req.params.userId
    );

    res.status(200).json({
        status: 'success',
        data: {
            subscriptionUserAvailed,
        },
    });
});

exports.updateUserTokenSubscription = catchAsync(async (req, res, next) => {
    const updatedTokens = await SubscriptionAvailed.findOneAndUpdate(
        { bookingId: req.params.bookingId },
        {
            subscriptionDetails: req.body.subscriptionDetails,
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
