const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Service = require("../models/servicesModel");
const ServiceAvailed = require("../models/serviceAvailedModel");
const Subscription = require("../models/subscriptionModel");
const Booking = require("../models/bookingModel");
const AppError = require("../utils/appError");
const User = require("../models/userModel");
const BookingSubscription = require("../models/bookingSubscriptionModel");
const SubscriptionAvailed = require("../models/subscriptionAvailedModel");

exports.getCheckoutSession = async (req, res) => {
  try {
    let cartItems = await Cart.find({ owner: req.user._id });
    let line_items1 = [];
    for (const item of cartItems) {
      let newItem = {
        price_data: {
          currency: "eur",
          unit_amount: item.price * 100,
          product_data: {
            name: `${item.product}-${item.plateNumber}`,
            description: item.description,
          },
        },
        quantity: 1,
      };
      line_items1.push(newItem);
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      success_url: `${req.protocol}://${req.get("host")}/carts?payment=success`,
      cancel_url: `${req.protocol}://${req.get("host")}/carts?payment=failure`,
      customer_email: req.user.email,
      client_reference_id: req.params.userId,
      line_items: line_items1,
      mode: "payment",
    });

    res.status(200).json({
      status: "success",
      session,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred.",
    });
  }
};

exports.webhookCheckout = async (req, res) => {
  console.log("INSIDE WEBHOOK CHECKOUT");

  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      console.log("CHECKOUT IS SUCCESSFUL");
      console.log(event.data.object);
    }

    console.log("FINISHED");

    res.status(200).json({
      received: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred.",
    });
  }
};

const createBookingCheckout = async (session) => {
  // if successful booking create a checkout and clear the items in cart by the user

  console.log("inside create booking checkout");

  const owner = session.client_reference_id;
  const carts = await Cart.find({ owner: owner });

  for (const cart of carts) {
    const newBooking = await Booking.create({
      tokensAmount: 1,
      owner: owner,
      product: cart.product,
      classification: cart.classification,
      plateNumber: cart.plateNumber,
      stripeReferenceNumber: session.payment_intent,
    });
    generateTokenForUser(newBooking._id);
  }
  deleteItemsInCart(session);
};

const deleteItemsInCart = async (session) => {
  const owner = session.client_reference_id;
  await Cart.deleteMany({ owner: owner });
};
