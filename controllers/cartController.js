const Cart = require("../models/cartModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getItemsInCart = catchAsync(async (req, res, next) => {
  const cartItems = await Cart.find({ owner: req.params.userId });

  res.status(200).json({
    status: "success",
    data: {
      cart: cartItems,
    },
  });
});

exports.addItemsInCart = catchAsync(async (req, res, next) => {
  console.log("req.body:", req.body);
  const cart = await Cart.create(req.body);
  res.status(200).json({
    status: "success",
    data: {
      cart,
    },
  });
});

exports.removeItemInCart = catchAsync(async (req, res, next) => {
  const itemsInCart = await Cart.findByIdAndDelete(req.params.productId);
  if (!itemsInCart) {
    return next(new AppError("No item in cart found with that id", 400));
  }
  res.status(200).json({
    status: "success",
    data: null,
  });
});

exports.clearCart = catchAsync(async (req, res, next) => {
  await Cart.deleteMany({ owner: req.params.userId });
  res.status(200).json({
    status: "success",
    data: null,
  });
});
