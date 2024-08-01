const User = require("../models/userModel");
const Vehicle = require("../models/vehicleModel");
const VehicleClassification = require("../models/vehicleClassificationModel");
const Service = require("../models/servicesModel");
const Subscription = require("../models/subscriptionModel");
const Cart = require("../models/cartModel");
const ServiceAvailed = require("../models/serviceAvailedModel");
const Review = require("../models/reviewModel");
const SubscriptionAvailed = require("../models/subscriptionAvailedModel");
const Product = require("../models/productModel");
const Receipt = require("../models/receiptModel");

exports.getLoginForm = (req, res, next) => {
  try {
    res.status(200).render("login", {
      title: "Log into your account",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred.",
    });
  }
};

exports.getHomepage = (req, res, next) => {
  try {
    res.status(200).render("homepage");
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred.",
    });
  }
};

exports.getAdminDashboard = async (req, res, next) => {
  try {
    const allVehicles = await Vehicle.find({}).populate({ path: "owner", select: "lastName firstName" });
    const allReceipts = await Receipt.find({});

    const productMap = new Map();

    allReceipts.forEach((receipt) => {
      receipt.products.forEach((product) => {
        if (product.name.includes('WASH')) {
          return;
        }
        console.log(`Processing product: ${product.name}, Quantity: ${product.quantity}, Price: ${product.price}`);
        if (productMap.has(product.name)) { // if product already exists in the map
          const existingProduct = productMap.get(product.name);
          console.log(`Updating existing product: ${product.name}`);
          existingProduct.totalQuantity += product.quantity;
          existingProduct.totalPrice += (product.quantity * product.price);
          console.log(`Updated product: ${product.name}, New Quantity: ${existingProduct.totalQuantity}, New Total Price: ${existingProduct.totalPrice}`);
        } else {
          console.log(`Adding new product: ${product.name}`);
          productMap.set(product.name, {
            name: product.name,
            totalQuantity: product.quantity,
            totalPrice: product.quantity * product.price,
          });
          console.log(`Added product: ${product.name}, Quantity: ${product.quantity}, Total Price: ${product.quantity * product.price}`);
        }
      });
    });

    const products = Array.from(productMap.values());
    
    res.status(200).render("adminDashboard", {
      title: "Admin Dashboard",
      allVehicles,
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred.",
    });
  }
};

exports.getDashboard = async (req, res, next) => {
  try {
    const user = req.user;

    if (user.role === "user") {
      const vehicleClassifications = await VehicleClassification.find();
      const vehicles = await Vehicle.find({ owner: user._id });
      const serviceAvailed = await ServiceAvailed.find({ owner: user._id });
      const receipts = await Receipt.find({ owner: user._id });

      const filteredReceipts = receipts.map((receipt) => {
        const filteredProducts = receipt._doc.products.filter((product) => !product.name.includes('WASH'));
        return { ...receipt._doc, products: filteredProducts };
      }).filter((receipt) => receipt.products.length > 0);

      res.status(200).render("dashboard", {
        title: "Dashboard",
        user,
        vehicleClassifications,
        vehicles,
        serviceAvailed,
        filteredReceipts,
      });
    }
    if (user.role === "admin") {
      const allVehicles = await Vehicle.find({}).populate({ path: "owner", select: "lastName firstName" });
      const allReceipts = await Receipt.find({});

      const productMap = new Map();

      allReceipts.forEach((receipt) => {
        receipt.products.forEach((product) => {
          if (product.name.includes('WASH')) {
            return;
          }
          console.log(`Processing product: ${product.name}, Quantity: ${product.quantity}, Price: ${product.price}`);
          if (productMap.has(product.name)) { // if product already exists in the map
            const existingProduct = productMap.get(product.name);
            console.log(`Updating existing product: ${product.name}`);
            existingProduct.totalQuantity += product.quantity;
            existingProduct.totalPrice += (product.quantity * product.price);
            console.log(`Updated product: ${product.name}, New Quantity: ${existingProduct.totalQuantity}, New Total Price: ${existingProduct.totalPrice}`);
          } else {
            console.log(`Adding new product: ${product.name}`);
            productMap.set(product.name, {
              name: product.name,
              totalQuantity: product.quantity,
              totalPrice: product.quantity * product.price,
            });
            console.log(`Added product: ${product.name}, Quantity: ${product.quantity}, Total Price: ${product.quantity * product.price}`);
          }
        });
      });

      const products = Array.from(productMap.values());
      
      res.status(200).render("adminDashboard", {
        title: "Admin Dashboard",
        allVehicles,
        products,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred.",
    });
  }
};

exports.getVehicleClassifications = async (req, res, next) => {
  try {
    const vehicleClassification = await VehicleClassification.find();

    res.status(200).render("vehicleClassification", {
      title: "Vehicle Classification",
      vehicleClassification,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred.",
    });
  }
};

exports.getServices = async (req, res, next) => {
  try {
    const services = await Service.find();
    const vehicleClassification = await VehicleClassification.find();
    if (res.locals.user === "nouser") {
      console.log("no user");
    }
    let user = res.locals.user;
    let vehicles = undefined;
    if (user && user.role === "user") {
      vehicles = await Vehicle.find({ owner: user._id });
    }

    res.status(200).render("services", {
      title: "Services",
      services,
      vehicleClassification,
      user,
      vehicles,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred.",
    });
  }
};

exports.getReviews = async (req, res, next) => {
  try {
    const serviceName = req.params.serviceName;
    console.log("Getting reviews for " + serviceName);

    let reviews = await Review.find({ service: serviceName }).populate({
      path: "user",
      select: "lastName firstName email photo",
    });

    res.status(200).render("reviews", {
      title: "Reviews",
      reviews,
      serviceName,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred.",
    });
  }
};

exports.getSubscriptions = async (req, res, next) => {
  try {
    const services = await Service.find();
    const subscriptions = await Subscription.find();
    const vehicleClassifications = await VehicleClassification.find();

    let vehiclesOwned = undefined;
    if (res.locals.user === "nouser") {
      console.log("no user");
    }
    let user = res.locals.user;
    if (user && user.role == "user") {
      vehiclesOwned = await Vehicle.find({ owner: user._id });
      console.log(vehiclesOwned);
    }
    res.status(200).render("subscriptions", {
      title: "Subscriptions",
      subscriptions,
      services,
      vehicleClassifications,
      user,
      vehiclesOwned,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred.",
    });
  }
};

exports.getRegister = async (req, res, next) => {
  try {
    res.status(200).render("register", {
      title: "Create new Account",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred.",
    });
  }
};

exports.getCart = async (req, res, next) => {
  try {
    let user = res.locals.user;
    let cartItems = undefined;

    if (user.role === "user") {
      cartItems = await Cart.find({ owner: res.locals.user });
    }

    res.status(200).render("cart", {
      title: "Cart",
      cartItems,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred.",
    });
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();

    res.status(200).render("product-catalog", {
      title: "Products",
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred.",
    });
  }
};

exports.getReceiptById = async (req, res, next) => {
  try {
    const receipt = await Receipt.findById(req.params.id);

    res.status(200).render("receipt", {
      title: "Receipt",
      receipt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred.",
    });
  }
};
