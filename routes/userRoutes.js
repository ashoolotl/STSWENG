const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// so that all of these routes will be protected
router.use(authController.protect);

router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

router.patch('/updateMyPassword', authController.updatePassword);

router
    .route('/')
    .get(authController.restrictTo('admin'), userController.getAllUser);
router
    .route('/:userId')
    .get(
        authController.protect,
        authController.restrictTo('admin'),
        userController.getUserById
    );
module.exports = router;
