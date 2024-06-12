const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
    tokensAmount: {
        type: Number,
        required: [true, 'There must be a token'],
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'This product must have a owner'],
    },
    product: {
        type: String,
        required: [true, 'There must be a product name'],
    },
    plateNumber: {
        type: String,
        required: [true, 'There must be a plate number'],
    },
    classification: {
        type: String,
        required: [true, 'There must be a vehicle classification'],
    },
    scheduledDate: {
        type: Date,
    },
    stripeReferenceNumber: {
        type: String,
        require: [true, 'There must be a stripe reference number'],
    },
    status: {
        type: String,
    },
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
