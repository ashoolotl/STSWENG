const express = require('express');
const vehicleClassification = require('../controllers/vehicleClassificationController');
const authController = require('../controllers/authController');

const router = express.Router();

// we need to protect this route
router.use(authController.protect);
router.use(authController.restrictTo('admin'));
router
    .route('/')
    .get(vehicleClassification.getAllClassification)
    .post(
        vehicleClassification.validateVehicleClassificationData,
        vehicleClassification.uploadVehicleClassificationPhoto,
        vehicleClassification.resizeVehicleClassificationPhoto,
        vehicleClassification.createClassification
    );

router
    .route('/:classificationId')
    .patch(
        // vehicleClassification.updateServiceWithVehicleClass,
        vehicleClassification.uploadVehicleClassificationPhoto,
        vehicleClassification.resizeVehicleClassificationPhoto,
        vehicleClassification.updateServiceWithVehicleClass,
        vehicleClassification.updateClassification
    )
    .delete(
        vehicleClassification.deleteServiceWithVehicleClass,
        vehicleClassification.deleteClassification
    );

module.exports = router;
