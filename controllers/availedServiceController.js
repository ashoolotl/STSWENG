const ServiceAvailed = require('../models/serviceAvailedModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllServiceAvailed = catchAsync(async (req, res, next) => {
    try {
        const serviceAvailed = await ServiceAvailed.find();

        res.status(200).json({
            status: 'success',
            data: {
                serviceAvailed,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "An error occurred.",
        });
    }
});

exports.getAvailedServiceById = catchAsync(async (req, res, next) => {
    try {
        const serviceAvailed = await ServiceAvailed.findById(req.params.userId);

        res.status(200).json({
            status: 'success',
            data: {
                serviceAvailed,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "An error occurred.",
        });
    }
});

exports.deleteAvailedService = catchAsync(async (req, res, next) => {
    try {
        const deletedDoc = await ServiceAvailed.findOneAndDelete({
            bookingId: req.params.userId,
        });

        res.status(200).json({
            status: 'success',
            data: null,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "An error occurred.",
        });
    }
});
