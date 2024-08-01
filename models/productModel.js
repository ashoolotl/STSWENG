const mongoose = require("mongoose");
const productModel = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "The item must have a name"],
  },
  description: {
    type: String,
    default: "None",
    required: [true, "The item must have a description"],
  },
  price: {
    type: Number,
    default: 0,
    required: [true, "The item must have a price"],
  },
  quantity: {
    type: Number,
    default: 1,
  },
  image: {
    type: String,
    default: "default-product-image.png",
  },
});

const Product = mongoose.model("Product", productModel);
module.exports = Product;
