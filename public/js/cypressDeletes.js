const Vehicle = require("../../models/vehicleModel");
const User = require("../../models/userModel");
const Product = require("../../models/productModel");
const Receipt = require("../../models/receiptModel");
const Cart = require("../../models/cartModel");

exports.deleteAllCarts = async () => {
  try {
    await Cart.deleteMany({});
    console.log("All carts deleted successfully.");
  } catch (error) {
    console.error("Error deleting carts:", error);
    throw error;
  }
};

exports.deleteCarByPlateNumber = async (plateNumber) => {
  try {
    const result = await Vehicle.findOneAndDelete({ plateNumber: plateNumber });
    if (result) {
      console.log(`Vehicle with plate number ${plateNumber} deleted successfully.`);
    } else {
      console.log(`No vehicle found with plate number ${plateNumber}.`);
    }
  } catch (error) {
    console.error(`Error deleting vehicle with plate number ${plateNumber}:`, error);
    throw error;
  }
};

exports.deleteUserByEmail = async (email) => {
  try {
    const result = await User.findOneAndDelete({ email: email });
    if (result) {
      console.log(`User with email ${email} deleted successfully.`);
    } else {
      console.log(`No user found with email ${email}.`);
    }
  } catch (error) {
    console.error(`Error deleting user with email ${email}:`, error);
    throw error;
  }
};

exports.deleteProductByName = async (name) => {
  try {
    const result = await Product.findOneAndDelete({ name: name });
    if (result) {
      console.log(`Product with name ${name} was deleted.`);
    } else {
      console.log(`Product with name ${name} not found.`);
    }
  } catch (error) {
    console.error("Error deleting product:", error);
  }
};

exports.deleteReceiptById = async (id) => {
  try {
    const result = await Receipt.findOneAndDelete({ _id: id });
    if (result) {
      console.log(`Receipt with id ${id} was deleted.`);
    } else {
      console.log(`Receipt with id ${id} not found.`);
    }
  } catch (error) {
    console.error("Error deleting receipt:", error);
  }
};
