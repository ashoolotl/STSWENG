const mongoose = require('mongoose');
const serviceAvailedSchema = new mongoose.Schema({
    tokensAmount: {
        type: Number,
        required: [true, 'There must be a token'],
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'There must be an owner'],
    },
    product: {
        type: String,
        required: [true, 'There must be a service or subscription name'],
    },
    plateNumber: {
        type: String,
        required: [true, 'There must be a plate number'],
    },
    date: {
        type: Date,
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: [true, 'There must be a booking id'],
    },
});

const ServiceAvailed = mongoose.model('ServiceAvailed', serviceAvailedSchema);

module.exports = ServiceAvailed;
