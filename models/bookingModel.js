const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema({
  tokensAmount: {
    type: Number,
    required: [true, "There must be a token"],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "This product must have a owner"],
  },
  product: {
    type: String,
    required: [true, "There must be a product name"],
  },
  plateNumber: {
    type: String,
    default: "None",
  },
  classification: {
    type: String,
    default: "None",
  },
  scheduledDate: {
    type: Date,
    default: Date.now(),
  },
  quantity: {
    type: Number,
    default: 1,
  },
  stripeReferenceNumber: {
    type: String,
    required: [true, "There must be a stripe reference number"],
  },
  status: {
    type: String,
    default: "None",
  },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
