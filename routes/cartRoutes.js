const express = require('express');
const cartsController = require('../controllers/cartController');
const authController = require('../controllers/authController');
const router = express.Router();

router.use(authController.protect);
router.use(authController.isLoggedIn);

router
    .route('/')
    .get(cartsController.getItemsInCart)
    .post(cartsController.addItemsInCart);

router.route('/:productId').delete(cartsController.removeItemInCart);
module.exports = router;
