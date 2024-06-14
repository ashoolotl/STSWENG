const multer = require('multer');
const sharp = require('sharp');
const VehicleClassification = require('../models/vehicleClassificationModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Service = require('../models/servicesModel');
const Subscription = require('../models/subscriptionModel');

const multerStorage = multer.memoryStorage();
const multerFile = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(
            new AppError('Not an image! Please upload only images.', 400),
            false
        );
    }
};
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFile,
});

exports.uploadVehicleClassificationPhoto = upload.single('photo');

exports.resizeVehicleClassificationPhoto = (req, res, next) => {
    if (!req.file) {
        return next();
    }
    req.file.filename = `${req.body.name.toUpperCase()}.jpeg`;
    sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/images/vehicleClassification/${req.file.filename}`);

    next();
};

exports.createClassification = catchAsync(async (req, res, next) => {
    let fileName = 'DEFAULT.jpeg';
    if (req.file) {
        fileName = req.file.filename;
    }
    const newClassification = await VehicleClassification.create({
        name: req.body.name,
        photo: fileName,
    });
    res.status(200).json({
        status: 'success',
        data: {
            vehicleClassification: newClassification,
        },
    });
});

exports.getAllClassification = catchAsync(async (req, res, next) => {
    const classification = await VehicleClassification.find().select('-__v');
    res.status(200).json({
        status: 'Success',
        results: classification.length,
        data: {
            vehicleClassification: classification,
        },
    });
});

exports.validateVehicleClassificationData = catchAsync(
    async (req, res, next) => {
        const { name } = req.body;
        const method = req.method;

        // if it is a post request, validate it inside the model
        if (method === 'POST') {
            return next();
        }
        if (method === 'PATCH') {
            return next();
        }
        // fetch the existing vehicle classification
        const vehicleClassification = await VehicleClassification.findById(
            req.params.classificationId
        );
        // if there is no vehicle classification return an error
        if (!vehicleClassification) {
            return next(
                new AppError(
                    `There is no vehicle classification found with that id`
                )
            );
        }
        // if there is a vehicle classification,
        // fetch all vehicle classification
        const allVehicleClassifications = await VehicleClassification.find();

        let nameUpperCase = name.toUpperCase();

        // Loop through all of the vehicle classification, if this returned true it means that the name is duplicate, if false it is the only one
        const nameAlreadyExists = allVehicleClassifications.some(
            (classification) => {
                return (
                    classification.name.toUpperCase() === nameUpperCase &&
                    classification._id.toString() !==
                        req.params.classificationId
                );
            }
        );
        if (nameAlreadyExists) {
            return next(
                new AppError(
                    `The ${nameUpperCase} vehicle classification is already registered. Please choose another name.`,
                    400
                )
            );
        }
        next();
    }
);

exports.updateServiceWithVehicleClass = catchAsync(async (req, res, next) => {
    console.log('INSIDE UPDATE SERVICE WITH CLASS');
    const vehicleClassification = await VehicleClassification.findById(
        req.params.classificationId
    ).distinct('name');
    if (!vehicleClassification) {
        console.log('ERROR HERE');
        return next(new AppError('No classification found with that id', 404));
    }

    await Service.updateMany(
        { 'prices.vehicleClassification': vehicleClassification[0] },
        {
            $set: {
                'prices.$[elem].vehicleClassification': req.body.name,
            },
        },
        {
            arrayFilters: [
                { 'elem.vehicleClassification': vehicleClassification[0] },
            ],
            new: true, // Return the modified document
            runValidators: true, // Run validators on the update operation
        } // Array filter to specify the condition inside the array
    );
    return next();
});
exports.updateClassification = catchAsync(async (req, res, next) => {
    let fileName = 'DEFAULT.jpeg';
    if (req.file) {
        fileName = req.file.filename;
        const classification = await VehicleClassification.findByIdAndUpdate(
            req.params.classificationId,
            {
                name: req.body.name,
                photo: fileName,
            },
            {
                new: true,
                runValidators: true,
            }
        );
        await classification.save();
        res.status(200).json({
            status: 'success',
            data: {
                vehicleClassification: classification,
            },
        });
        if (!classification) {
            return next(
                new AppError('No classification found with that id', 404)
            );
        }
    }
    if (!req.file) {
        const classification = await VehicleClassification.findByIdAndUpdate(
            req.params.classificationId,
            req.body,
            { new: true, runValidators: true }
        );
        await classification.save();
        res.status(200).json({
            status: 'success',
            data: {
                vehicleClassification: classification,
            },
        });
        if (!classification) {
            return next(
                new AppError('No classification found with that id', 404)
            );
        }
    }
});

exports.deleteServiceWithVehicleClass = async (req, res, next) => {
    console.log('DELETION OF SERVICE WITH VEHICLE CLASS IS HERE');
    const classification = await VehicleClassification.findById(
        req.params.classificationId
    );
    if (!classification) {
        return next(new AppError('No classification found with that id', 404));
    }

    const servicesToUpdate = await Service.find({
        'prices.vehicleClassification': classification.name,
    });

    for (const service of servicesToUpdate) {
        // If the service has only one price remaining and it matches the classification to delete, delete the service
        if (
            service.prices.length === 1 &&
            service.prices[0].vehicleClassification === classification.name
        ) {
            // since we are deleting service, we also need to update pull or delete all data with that service

            // delete here the subscription which contains this service and check in THE SUBSCRIPTION IF ITS PRICES IS 1 AND ONLY CONTAINS THE SERVICE TO BE DELETE

            // check all the subscriptions that contains the service name and check if it is 1 only delete the subscription other wise update
            console.log('DEBUG DEBUG');
            const subscriptions = await Subscription.find({
                'prices.services.service': service.name,
            });
            console.log(subscriptions);
            for (subscription of subscriptions) {
                for (s of subscription.prices) {
                    if (s.services.length == 1) {
                        await Subscription.findByIdAndDelete(subscription._id);
                    } else {
                        // update the description and use pull
                        await Subscription.updateMany(
                            {
                                'prices.services.service': service.name,
                            },
                            {
                                $pull: {
                                    'prices.$[price].services': {
                                        service: service.name,
                                    },
                                },
                            },
                            {
                                arrayFilters: [
                                    { 'price.services.service': service.name },
                                ], // Filter the array to only apply to documents where the service is found
                                new: true,
                                runValidators: false,
                            }
                        );
                    }
                }
            }
            // Update the description for each subscription
            const subscriptionsUpdate = await Subscription.find(); // Get all subscriptions
            for (const subscription of subscriptionsUpdate) {
                // Construct updated description based on the remaining services in the prices array
                const serviceDescriptions = subscription.prices[0].services
                    .map(
                        (service) =>
                            `${service.tokensAmount} ${service.service}`
                    )
                    .join(', ');

                // Update the description field
                await Subscription.findByIdAndUpdate(subscription._id, {
                    description: serviceDescriptions,
                });
            }

            await Service.findByIdAndDelete(service._id);

            // if it contains the service to be deleted,  and is only 1 delete the subscription, else just remove it from the array
        } else {
            await Service.updateMany(
                {
                    'prices.vehicleClassification': classification.name,
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

    // before we pull let us check if the length is one
};

exports.deleteClassification = catchAsync(async (req, res, next) => {
    const classification = await VehicleClassification.findById(
        req.params.classificationId
    );

    if (!classification) {
        return next(new AppError('No classification found with that id', 404));
    }
    await classification.deleteOne();
    // delete from the services

    res.status(204).json({
        status: 'success',
        data: null,
    });
});
