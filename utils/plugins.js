const mongoose = require('mongoose');
const AppError = require('../utils/appError');

// Plugin for handling duplicate entries
exports.handleDuplicatesPlugin = function (schema, options) {
    schema.pre('save', async function (next) {
        let fieldName = '';
        let errorMessageTemplate1 = '';
        let errorMessageTemplate2 = '';
        if (this.constructor.modelName == 'Subscription') {
            fieldName = 'service';
            errorMessageTemplate1 = 'subscription';
            errorMessageTemplate2 = 'service to add in this subscription';
        } else if (this.constructor.modelName == 'Service') {
            fieldName = 'vehicleClassification';
            errorMessageTemplate1 = 'service';
            errorMessageTemplate2 =
                'vehicle classification to add in this service';
        } else {
            return next(
                new AppError('Unsupported Model. Fix this inside plugins', 400)
            );
        }
        const dataSet = new Set();
        for (price of this.prices) {
            if (dataSet.has(price[fieldName])) {
                return next(
                    new AppError(
                        `${price[fieldName]} is already in this ${errorMessageTemplate1}. Please choose another ${errorMessageTemplate2}`,
                        400
                    )
                );
            }
            dataSet.add(price[fieldName]);
        }
        next();
    });
};
