const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const router = express.Router();
router.use(authController.isLoggedIn);

router.get('/login', viewsController.getLoginForm);
router.get('/', viewsController.getHomepage);
router.get('/dashboard', authController.protect, viewsController.getDashboard);
router.get(
    '/admin-dashboard',
    authController.protect,
    authController.restrictTo('admin'),
    viewsController.getAdminDashboard
);
router.get(
    '/vehicle-classifications',
    authController.protect,
    authController.restrictTo('admin'),
    viewsController.getVehicleClassifications
);
router.get('/services', viewsController.getServices);
router.get('/subscriptions', viewsController.getSubscriptions);
router.get('/register', viewsController.getRegister);
router.get('/carts', authController.protect, viewsController.getCart);
router.get(
    '/adminDashboard',
    authController.protect,
    authController.restrictTo('admin'),
    viewsController.getAdminDashboard
);
module.exports = router;
