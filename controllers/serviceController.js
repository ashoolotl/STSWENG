const multer = require('multer');
const sharp = require('sharp');
const Service = require('../models/servicesModel');
const Subscription = require('../models/subscriptionModel');
const VehicleClassification = require('../models/vehicleClassificationModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

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

exports.uploadServicePhoto = upload.single('photo');

exports.resizeServicePhoto = (req, res, next) => {
    if (!req.file) {
        return next();
    }

    req.file.filename = `${req.body.name.toUpperCase()}.jpeg`;
    sharp(req.file.buffer)
        .resize(3200, 1800)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/images/services/DEFAULT.jpeg`);

    next();
};

exports.validateServiceData = catchAsync(async (req, res, next) => {
    const { prices, name } = req.body;

    // first step check if it is a patch request
    if (req.method === 'PATCH') {
        const doesServiceExist = await Service.findById(req.params.serviceId);
        if (!doesServiceExist) {
            return next(new AppError(`There is no service with that id`, 400));
        }
    }
    if (name) {
        // next step is to check if the client wants to change the service name but it is already registered send an error
        const services = await Service.find();

        let serviceNameUpperCase = name.toUpperCase();
        const serviceNameAlreadyExist = services.some((service) => {
            return (
                service.name.toUpperCase() === serviceNameUpperCase &&
                service._id.toString() !== req.params.serviceId
            );
        });
        if (serviceNameAlreadyExist) {
            return next(
                new AppError(
                    `The ${serviceNameUpperCase} service is already registered. Please choose another service name`,
                    400
                )
            );
        }
    }
    if (prices) {
        // check if the input is a valid vehicle classification
        const vehicleClassificationList =
            await VehicleClassification.find().distinct('name');
        const vehicleClassificationSet = new Set(vehicleClassificationList);
        for (price of prices) {
            price.vehicleClassification =
                price.vehicleClassification.toUpperCase();
            if (!vehicleClassificationSet.has(price.vehicleClassification)) {
                return next(
                    new AppError(
                        `There is no ${price.vehicleClassification} registered as a vehicle classification. Please use another vehicle classification`,
                        400
                    )
                );
            }
        }
    }
    next();
});

exports.getAllServices = catchAsync(async (req, res, next) => {
    const services = await Service.find().select('-__v');
    res.status(200).json({
        status: 'success',
        results: services.length,
        data: {
            services,
        },
    });
});

exports.createService = catchAsync(async (req, res, next) => {
    // validate that the vehicle classification is only
    let fileName = 'DEFAULT.jpeg';
    // if (req.body.photo) {
    //     fileName = req.body.photo;
    // }

    const newService = await Service.create({
        name: req.body.name,
        description: req.body.description,
        duration: req.body.duration,
        photo: fileName,
        prices: req.body.prices,
    });
    res.status(201).json({
        status: 'success',
        data: {
            services: newService,
        },
    });
});

exports.updateSubscriptionWithService = catchAsync(async (req, res, next) => {
    console.log('INSIDE UPDATE SERVICE WITH SUBSCRIPTION');
    console.log(req.body);
    const service = await Service.findById(req.params.serviceId);
    if (!service) {
        return next(new AppError('No classification found with that id', 400));
    }

    console.log(service.name);

    // Iterate over each subscription document and update

    await Subscription.updateMany(
        { 'prices.services.service': service.name },
        {
            $set: {
                'prices.$[price].services.$[elem].service': req.body.name,
            },
        },
        {
            arrayFilters: [
                { 'price.services.service': service.name },
                { 'elem.service': service.name },
            ],
            new: true, // Return the modified document
            runValidators: true, // Run validators on the update operation
        } // Array filter to specify the condition inside the array
    );
    const subscriptionsUpdate = await Subscription.find(); // Get all subscriptions
    for (const subscription of subscriptionsUpdate) {
        // Construct updated description based on the remaining services in the prices array
        const serviceDescriptions = subscription.prices[0].services
            .map((service) => `${service.tokensAmount} ${service.service}`)
            .join(', ');

        // Update the description field
        await Subscription.findByIdAndUpdate(subscription._id, {
            description: serviceDescriptions,
        });
    }
    return next();
});

exports.editService = catchAsync(async (req, res, next) => {
    console.log(req.file);
    console.log('DEBUG DEBUG');
    if (req.file) {
        const service = await Service.findByIdAndUpdate(
            req.params.serviceId,
            {
                name: req.body.name,
                description: req.body.description,
                duration: req.body.duration,
                photo: req.file.filename,
                prices: req.body.prices,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!service) {
            return next(new AppError('No service found with that id', 400));
        }
        // await service.save();
        // to run the middleware that checks if valid vehicle classification is placed
        res.status(200).json({
            status: 'success',
            data: {
                service,
            },
        });
    }
    if (!req.file) {
        const service = await Service.findByIdAndUpdate(
            req.params.serviceId,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!service) {
            return next(new AppError('No service found with that id', 400));
        }
        // await service.save();
        // to run the middleware that checks if valid vehicle classification is placed
        res.status(200).json({
            status: 'success',
            data: {
                service,
            },
        });
    }
});
exports.deleteServiceWithSubscription = catchAsync(async (req, res, next) => {
    const service = await Service.findById(req.params.serviceId);
    if (!service) {
        return next(new AppError('No classification found with that id', 404));
    }

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
            .map((service) => `${service.tokensAmount} ${service.service}`)
            .join(', ');

        // Update the description field
        await Subscription.findByIdAndUpdate(subscription._id, {
            description: serviceDescriptions,
        });
    }

    next();
});
async function getDescriptionWithoutService(serviceName) {
    // Find all subscriptions that still have the specified service
    const subscriptionsWithService = await Subscription.find({
        'prices.service': { $ne: serviceName }, // Exclude subscriptions with the specified service
    });
    console.log('INSIDE CONSTRUCTING NEW DESCRIPTION');
    // Construct updated description for each subscription
    console.log(subscriptionsWithService);
}
exports.deleteService = catchAsync(async (req, res, next) => {
    const service = await Service.findByIdAndDelete(req.params.serviceId);
    if (!service) {
        return next(new AppError('No service found with that id', 400));
    }
    res.status(204).json({
        status: 'success',
        data: null,
    });
});
