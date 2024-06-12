const mongoose = require('mongoose');
const subscriptionAvailedSchema = new mongoose.Schema({
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

const SubscriptionAvailed = mongoose.model(
    'SubscriptionAvailed',
    subscriptionAvailedSchema
);

module.exports = SubscriptionAvailed;
