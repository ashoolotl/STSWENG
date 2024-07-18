const Vehicle = require("../models/vehicleModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllVehicle = catchAsync(async (req, res, next) => {
  const vehicles = await Vehicle.find();
  res.status(200).json({
    status: "success",
    length: vehicles.length,
    data: {
      vehicle: vehicles,
    },
  });
});

exports.createVehicle = catchAsync(async (req, res, next) => {
  const vehicle = await Vehicle.create(req.body);
  console.log(req.body);
  res.status(200).json({
    status: "success",
    data: {
      vehicle,
    },
  });
});

exports.getVehicleByOwner = catchAsync(async (req, res, next) => {
  const vehicle = await Vehicle.find({ owner: req.params.ownerId });

  res.status(200).json({
    status: "success",
    data: {
      vehicle,
    },
  });
});

exports.updateVehicleStatus = catchAsync(async (req, res, next) => {
  console.log("updating vehicle by id");
  const vehicle = await Vehicle.findByIdAndUpdate(
    req.params.vehicleId,
    {
      status: req.body.status,
      lastService: req.body.lastService,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  console.log(vehicle);
  res.status(200).json({
    status: "success",
    data: {
      booking: vehicle,
    },
  });
});

exports.updateVehicleStatusByPlateNumber = catchAsync(async (req, res, next) => {
  console.log("updating vehicle by platenum");
  console.log("plate num", req.params.plateNumber);
  const vehicle = await Vehicle.findOneAndUpdate(
    { plateNumber: req.params.plateNumber },
    {
      status: req.body.status,
      lastService: req.body.lastService,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      booking: vehicle,
    },
  });
});

exports.getVehicleById = catchAsync(async (req, res, next) => {
  const vehicle = await Vehicle.find({
    plateNumber: req.params.plateNumber,
  });
  res.status(200).json({
    status: "success",
    data: {
      vehicle,
    },
  });
});
