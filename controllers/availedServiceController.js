const ServiceAvailed = require("../models/serviceAvailedModel");
const AppError = require("../utils/appError");

exports.getAllServiceAvailed = async (req, res, next) => {
  try {
    const serviceAvailed = await ServiceAvailed.find();

    res.status(200).json({
      status: "success",
      data: {
        serviceAvailed,
      },
    });
  } catch (err) {
    next(new AppError("Failed to retrieve services availed", 500));
  }
};

exports.getAvailedServiceById = async (req, res, next) => {
  try {
    const serviceAvailed = await ServiceAvailed.findById(req.params.userId);

    if (!serviceAvailed) {
      return next(new AppError("No service availed found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        serviceAvailed,
      },
    });
  } catch (err) {
    next(new AppError("Failed to retrieve the service availed", 500));
  }
};

exports.deleteAvailedService = async (req, res, next) => {
  try {
    const deletedDoc = await ServiceAvailed.findOneAndDelete({
      bookingId: req.params.userId,
    });

    if (!deletedDoc) {
      return next(new AppError("No service availed found with that booking ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(new AppError("Failed to delete the service availed", 500));
  }
};
