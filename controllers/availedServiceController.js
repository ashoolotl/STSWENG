const ServiceAvailed = require('../models/serviceAvailedModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllServiceAvailed = catchAsync(async (req, res, next) => {
    const serviceAvailed = await ServiceAvailed.find();

    res.status(200).json({
        status: 'success',
        data: {
            serviceAvailed,
        },
    });
});
exports.getAvailedServiceById = catchAsync(async (req, res, next) => {
    const serviceAvailed = await ServiceAvailed.findById(req.params.userId);

    res.status(200).json({
        status: 'success',
        data: {
            serviceAvailed,
        },
    });
});
exports.deleteAvailedService = catchAsync(async (req, res, next) => {
    const deletedDoc = await ServiceAvailed.findOneAndDelete({
        bookingId: req.params.userId,
    });

    res.status(200).json({
        status: 'success',
        data: null,
    });
});
