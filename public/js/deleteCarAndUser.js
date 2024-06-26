const Vehicle = require("../../models/vehicleModel");
const User = require("../../models/userModel");

const deleteCarByPlateNumber = async (plateNumber) => {
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

const deleteUserByEmail = async (email) => {
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

module.exports = { deleteCarByPlateNumber, deleteUserByEmail };
