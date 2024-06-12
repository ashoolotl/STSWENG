const mongoose = require('mongoose');
const operationalPerformanceSchema = new mongoose.Schema({
    workInProgress: {
        type: Date,
    },
    drying: {
        type: Date,
    },
    turnOver: {
        type: Date,
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: [true, 'There must be a booking id'],
    },
});

const OperationalPerformance = mongoose.model(
    'OperationalPerformance',
    operationalPerformanceSchema
);

module.exports = OperationalPerformance;
