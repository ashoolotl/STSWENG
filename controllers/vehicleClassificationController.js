const VehicleClassification = require("../models/vehicleClassificationModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Service = require("../models/servicesModel");
const Subscription = require("../models/subscriptionModel");

exports.createClassification = catchAsync(async (req, res, next) => {
  console.log("INSIDE CREATE CLASSIFICATION");

  let fileName;
  if (req.file) {
    fileName = req.file.filename;
  } else {
    fileName = "DEFAULT.jpeg";
  }

  const newClassification = await VehicleClassification.create({
    name: req.body.name,
    photo: fileName,
  });
  res.status(200).json({
    status: "success",
    data: {
      vehicleClassification: newClassification,
    },
  });
});

exports.getAllClassification = catchAsync(async (req, res, next) => {
  const classification = await VehicleClassification.find().select("-__v");
  res.status(200).json({
    status: "Success",
    results: classification.length,
    data: {
      vehicleClassification: classification,
    },
  });
});

exports.validateVehicleClassificationData = catchAsync(async (req, res, next) => {
  console.log("INSIDE VALIDATE VEHICLE CLASSIFICATION DATA");
  const { name } = req.body;
  const method = req.method;

  // if it is a post request, validate it inside the model
  if (method === "POST") {
    return next();
  }
  if (method === "PATCH") {
    return next();
  }
  // fetch the existing vehicle classification
  const vehicleClassification = await VehicleClassification.findById(req.params.classificationId);
  // if there is no vehicle classification return an error
  if (!vehicleClassification) {
    return next(new AppError(`There is no vehicle classification found with that id`));
  }
  // if there is a vehicle classification,
  // fetch all vehicle classification
  const allVehicleClassifications = await VehicleClassification.find();

  let nameUpperCase = name.toUpperCase();

  // Loop through all of the vehicle classification, if this returned true it means that the name is duplicate, if false it is the only one
  const nameAlreadyExists = allVehicleClassifications.some((classification) => {
    return classification.name.toUpperCase() === nameUpperCase && classification._id.toString() !== req.params.classificationId;
  });
  if (nameAlreadyExists) {
    return next(new AppError(`The ${nameUpperCase} vehicle classification is already registered. Please choose another name.`, 400));
  }
  next();
});

exports.updateServiceWithVehicleClass = catchAsync(async (req, res, next) => {
  const vehicleClassification = await VehicleClassification.findById(req.params.classificationId).distinct("name");
  if (!vehicleClassification) {
    return next(new AppError("No classification found with that id", 404));
  }

  await Service.updateMany(
    { "prices.vehicleClassification": vehicleClassification[0] },
    {
      $set: {
        "prices.$[elem].vehicleClassification": req.body.name,
      },
    },
    {
      arrayFilters: [{ "elem.vehicleClassification": vehicleClassification[0] }],
      new: true,
      runValidators: true,
    }
  );
  return next();
});

exports.updateClassification = catchAsync(async (req, res, next) => {
  const classification = await VehicleClassification.findByIdAndUpdate(req.params.classificationId, req.body, { new: true, runValidators: true });
  await classification.save();
  res.status(200).json({
    status: "success",
    data: {
      vehicleClassification: classification,
    },
  });
  if (!classification) {
    return next(new AppError("No classification found with that id", 404));
  }
});

exports.deleteServiceWithVehicleClass = async (req, res, next) => {
  const classification = await VehicleClassification.findById(req.params.classificationId);
  if (!classification) {
    return next(new AppError("No classification found with that id", 404));
  }

  const servicesToUpdate = await Service.find({
    "prices.vehicleClassification": classification.name,
  });

  for (const service of servicesToUpdate) {
    if (service.prices.length === 1 && service.prices[0].vehicleClassification === classification.name) {
      const subscriptions = await Subscription.find({
        "prices.services.service": service.name,
      });
      console.log(subscriptions);
      for (subscription of subscriptions) {
        for (s of subscription.prices) {
          if (s.services.length == 1) {
            await Subscription.findByIdAndDelete(subscription._id);
          } else {
            await Subscription.updateMany(
              {
                "prices.services.service": service.name,
              },
              {
                $pull: {
                  "prices.$[price].services": {
                    service: service.name,
                  },
                },
              },
              {
                arrayFilters: [{ "price.services.service": service.name }],
                new: true,
                runValidators: false,
              }
            );
          }
        }
      }

      const subscriptionsUpdate = await Subscription.find();
      for (const subscription of subscriptionsUpdate) {
        const serviceDescriptions = subscription.prices[0].services.map((service) => `${service.tokensAmount} ${service.service}`).join(", ");

        await Subscription.findByIdAndUpdate(subscription._id, {
          description: serviceDescriptions,
        });
      }

      await Service.findByIdAndDelete(service._id);
    } else {
      await Service.updateMany(
        {
          "prices.vehicleClassification": classification.name,
        },
        {
          $pull: {
            prices: { vehicleClassification: classification.name },
          },
        },
        {
          new: true,
          runValidators: false,
        }
      );
    }
  }
  next();
};

exports.deleteClassification = catchAsync(async (req, res, next) => {
  const classification = await VehicleClassification.findById(req.params.classificationId);

  if (!classification) {
    return next(new AppError("No classification found with that id", 404));
  }
  await classification.deleteOne();

  res.status(204).json({
    status: "success",
    data: null,
  });
});
