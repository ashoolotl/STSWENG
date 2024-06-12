const mongoose = require('mongoose');
const vehicleClassificationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please input the classification.'],
        uppercase: true,
        unique: true,
    },

    photo: {
        type: String,
        default: 'DEFAULT.jpeg',
    },
});

const VehicleClassification = mongoose.model(
    'VehicleClassification',
    vehicleClassificationSchema
);

module.exports = VehicleClassification;
