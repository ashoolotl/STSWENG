const mongoose = require('mongoose');
const vehicleSchema = new mongoose.Schema({
    classification: {
        type: String,
        required: [true, 'Please input the classification.'],
        uppercase: true,
    },
    brand: {
        type: String,
        required: [true, 'Please input the brand name.'],
        uppercase: true,
    },
    plateNumber: {
        type: String,
        required: [true, 'Please input the plate number'],
        unique: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        default: 'Not Available',
    },
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
