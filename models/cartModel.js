const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
    price: {
        type: Number,
        required: [true, 'The item must have a price'],
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'The item must have a owner'],
    },
    product: {
        type: String,
        required: [true, 'The cart must have a product'],
        uppercase: true,
    },
    plateNumber: {
        type: String,
        required: [true, 'There must be a plate number'],
    },
    classification: {
        type: String,
        required: [true, 'There must be a vehicle classification'],
    },
    description: {
        type: String,
        required: [true, 'There must be a description'],
    },
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
