const express = require('express');
const serviceController = require('../controllers/serviceController');
const authController = require('../controllers/authController');
const router = express.Router();
router.use(authController.protect);
router
    .route('/')
    .get(serviceController.getAllServices)
    .post(
        authController.protect,
        authController.restrictTo('admin'),
        serviceController.validateServiceData,
        serviceController.uploadServicePhoto,
        serviceController.resizeServicePhoto,
        serviceController.createService
    );

router.use(authController.restrictTo('admin'));
router
    .route('/:serviceId')
    .patch(
        //serviceController.validateServiceData,

        serviceController.uploadServicePhoto,
        serviceController.resizeServicePhoto,
        serviceController.updateSubscriptionWithService,
        serviceController.editService
    )
    .delete(
        serviceController.deleteServiceWithSubscription,
        serviceController.deleteService
    );

module.exports = router;
