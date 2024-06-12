const express = require('express');
const availedServiceController = require('../controllers/availedServiceController');
const authController = require('../controllers/authController');
const router = express.Router();
router.use(authController.protect);
router
    .route('/')
    .get(
        authController.protect,
        authController.restrictTo('admin'),
        availedServiceController.getAllServiceAvailed
    );

router
    .route('/:userId')
    .get(authController.protect, availedServiceController.getAvailedServiceById)
    .delete(
        authController.protect,
        authController.restrictTo('admin'),
        availedServiceController.deleteAvailedService
    );
module.exports = router;
