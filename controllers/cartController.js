const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getItemsInCart = catchAsync(async (req, res, next) => {
  try {
    const cartItems = await Cart.find({ owner: req.params.userId });

    res.status(200).json({
      status: "success",
      data: {
        cart: cartItems,
      },
    });
  } catch (err) {
    next(err);
  }
});

exports.addItemsInCart = catchAsync(async (req, res, next) => {
  try {
    const itemInCart = await Cart.findOne({ product: req.body.product });
    const product = await Product.findOne({ name: req.body.product });

    if (itemInCart && itemInCart.plateNumber === "None") {
      if (Number(itemInCart.quantity) + Number(req.body.quantity) <= Number(product.quantity)) {
        itemInCart.quantity += Number(req.body.quantity);
        itemInCart.price += Number(req.body.price);
        await itemInCart.save();
        return res.status(200).json({
          status: "success",
          data: {
            cart: itemInCart,
          },
        });
      } else {
        return res.status(400).json({
          status: "error",
          message: "Not enough stock for this product",
        });
      }
    } else {
      const cart = await Cart.create(req.body);
      res.status(200).json({
        status: "success",
        data: {
          cart,
        },
      });
    }
  } catch (err) {
    next(err);
  }
});

exports.removeItemInCart = catchAsync(async (req, res, next) => {
  try {
    const itemsInCart = await Cart.findByIdAndDelete(req.params.productId);
    if (!itemsInCart) {
      return next(new AppError("No item in cart found with that id", 400));
    }
    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
});

exports.clearCart = catchAsync(async (req, res, next) => {
  try {
    await Cart.deleteMany({ owner: req.params.userId });
    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
});
