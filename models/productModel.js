const mongoose = require("mongoose");
const productModel = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "The item must have a name"],
  },
  description: {
    type: String,
    required: [true, "The item must have a description"],
  },
  price: {
    type: Number,
    required: [true, "The item must have a price"],
  },
  stock: {
    type: Number,
    required: [true, "The item must have a stock"],
  },
  image: {
    type: String,
    required: [true, "The item must have a image"],
  },
});

const Product = mongoose.model("Product", productModel);
module.exports = Product;
