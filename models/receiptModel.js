const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "The item must have a name"],
  },
  quantity: {
    type: Number,
    default: 1,
  },
  price: {
    type: Number,
    default: 0,
  },
  plateNumber: {
    type: String,
    default: "Product",
  },
});

const receiptSchema = new mongoose.Schema({
  totalPrice: {
    type: Number,
    default: 0,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "The item must have an owner"],
  },
  products: {
    type: [productSchema],
    required: [true, "The item must have a product"],
  },
});

const Receipt = mongoose.model("Receipt", receiptSchema);

module.exports = Receipt;
