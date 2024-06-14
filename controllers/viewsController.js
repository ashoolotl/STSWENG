const Vehicle = require('../models/vehicleModel');
const VehicleClassification = require('../models/vehicleClassificationModel');
const Service = require('../models/servicesModel');
const Subscription = require('../models/subscriptionModel');
const Cart = require('../models/cartModel');
const ServiceAvailed = require('../models/serviceAvailedModel');
const Booking = require('../models/bookingModel');
const BookingSubscription = require('../models/bookingSubscriptionModel');
const SubscriptionAvailed = require('../models/subscriptionAvailedModel');
exports.getLoginForm = (req, res, next) => {
    res.status(200).render('login', {
        title: 'Log into your account',
    });
};

exports.getHomepage = (req, res, next) => {
    res.status(200).render('homepage');
};
exports.getAdminDashboard = async (req, res, next) => {
    const serviceBookings = await Booking.find({
        status: { $ne: 'Completed' },
        scheduledDate: { $exists: true },
    });
    console.log(serviceBookings);
    const subscriptionBookings = await BookingSubscription.find({
        status: { $ne: 'none' },
        scheduledDate: { $exists: true },
    });
    res.status(200).render('adminDashboard', {
        title: 'Admin Dashboard',

        serviceBookings,
        subscriptionBookings,
    });
};
exports.getDashboard = async (req, res, next) => {
    const user = req.user;

    if (user.role === 'user') {
        const vehicleClassifications = await VehicleClassification.find();
        const vehicles = await Vehicle.find({ owner: user._id });
        const serviceAvailed = await ServiceAvailed.find({ owner: user._id });
        const subscriptionsAvailed = await SubscriptionAvailed.find({
            owner: user._id,
        });
        res.status(200).render('dashboard', {
            title: 'Dashboard',
            user,
            vehicleClassifications,
            vehicles,
            serviceAvailed,
            subscriptionsAvailed,
        });
    }
    if (user.role === 'admin') {
        const serviceBookings = await Booking.find({
            status: { $ne: 'Completed' },
            scheduledDate: { $exists: true },
        });
        console.log(serviceBookings);
        const subscriptionBookings = await BookingSubscription.find({
            status: { $ne: 'none' },
            scheduledDate: { $exists: true },
        });
        res.status(200).render('adminDashboard', {
            title: 'Admin Dashboard',
            user,
            serviceBookings,
            subscriptionBookings,
        });
    }
};

exports.getVehicleClassifications = async (req, res, next) => {
    const vehicleClassification = await VehicleClassification.find();

    res.status(200).render('vehicleClassification', {
        title: 'Vehicle Classification',
        vehicleClassification,
    });
};

exports.getServices = async (req, res, next) => {
    const services = await Service.find();
    const vehicleClassification = await VehicleClassification.find();
    if (res.locals.user === 'nouser') {
        console.log('no user');
    }
    let user = res.locals.user;
    console.log(user);
    let vehicles = undefined;
    if (user && user.role === 'user') {
        vehicles = await Vehicle.find({ owner: user._id });
    }

    res.status(200).render('services', {
        title: 'Services',
        services,
        vehicleClassification,
        user,
        vehicles,
    });
};

exports.getSubscriptions = async (req, res, next) => {
    const services = await Service.find();
    const subscriptions = await Subscription.find();
    const vehicleClassifications = await VehicleClassification.find();

    let vehiclesOwned = undefined;
    if (res.locals.user === 'nouser') {
        console.log('no user');
    }
    let user = res.locals.user;
    if (user && user.role == 'user') {
        vehiclesOwned = await Vehicle.find({ owner: user._id });
        console.log(vehiclesOwned);
    }
    res.status(200).render('subscriptions', {
        title: 'Subscriptions',
        subscriptions,
        services,
        vehicleClassifications,
        user,
        vehiclesOwned,
    });
};

exports.getRegister = async (req, res, next) => {
    res.status(200).render('register', {
        title: 'Create new Account',
    });
};

exports.getCart = async (req, res, next) => {
    let user = res.locals.user;
    let cartItems = undefined;

    if (user.role === 'user') {
        cartItems = await Cart.find({ owner: res.locals.user });
        console.log(cartItems);
    }
    res.status(200).render('cart', {
        title: 'Cart',
        cartItems,
        user,
    });
};
