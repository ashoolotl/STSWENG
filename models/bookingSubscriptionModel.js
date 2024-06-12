const mongoose = require('mongoose');
const bookingSubscriptionSchema = new mongoose.Schema({
    subscriptionDetails: {
        type: [
            {
                service: {
                    type: String,
                    required: [true, 'Please input a service'],
                    uppercase: true,
                },
                tokensAmount: {
                    type: Number,
                    required: [
                        true,
                        'Please input number of tokens for this service',
                    ],
                },
            },
        ],
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
    chosenService: {
        type: String,
    },
});

const BookingSubscription = mongoose.model(
    'BookingSubscription',
    bookingSubscriptionSchema
);

module.exports = BookingSubscription;
