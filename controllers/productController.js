const Product = require("../models/productModel");

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      status: "success",
      data: {
        products,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching products.",
    });
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching product.",
    });
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const newProduct = await Product.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        product: newProduct,
      },
    });
  } catch (error) {
    console.error(error);
    res.statu(500).json({
      status: "error",
      message: "An error occurred while creating product.",
    });
  }
};

exports.editProduct = async (req, res, next) => {
  try {
    const updatedproduct = await Product.findByIdAndUpdate(req.params.id, req.boody, { new: true, runValidators: true });
    if (!updatedproduct) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
    }
    res.send(200).json({
      status: "success",
      data: {
        product: updatedproduct,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while updating product.",
    });
  }
};
