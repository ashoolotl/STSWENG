const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getItemsInCart = catchAsync(async (req, res, next) => {
  const cartItems = await ProductCart.find();

  res.status(200).json({
    status: "success",
    data: {
      cart: cartItems,
    },
  });
});

exports.addItemsInCart = catchAsync(async (req, res, next) => {
  const ProductCart = await ProductCart.create(req.body);
  res.status(200).json({
    status: "success",
    data: {
      cart,
    },
  });
});

exports.removeItemInCart = catchAsync(async (req, res, next) => {
  const itemsInCart = await ProductCart.findByIdAndDelete(req.params.productId);
  if (!itemsInCart) {
    return next(new AppError("No item in cart found with that id", 400));
  }
  res.status(200).json({
    status: "success",
    data: null,
  });
});
