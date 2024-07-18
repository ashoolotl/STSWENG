const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: [true, "The item must have a price"],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "The item must have a owner"],
  },
  product: {
    type: String,
    default: "None",
  },
  plateNumber: {
    type: String,
    default: "None",
  },
  classification: {
    type: String,
    default: "None",
  },
  description: {
    type: String,
    default: "None",
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
