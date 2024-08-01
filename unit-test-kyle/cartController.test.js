// cartController.test.js

const sinon = require('sinon');
const { describe, it, before, beforeEach, afterEach } = require('mocha');

// Dynamically import chai for ESM support
let chai, expect;
before(async () => {
  chai = await import('chai');
  expect = chai.expect;
});

// Import CommonJS modules
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const cartController = require('../controllers/cartController');
const AppError = require('../utils/appError');

describe('Cart Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
      user: { _id: 'userId123' },
    };

    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    next = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getItemsInCart', () => {
    it('should return items in the cart successfully', async () => {
      const cartItems = [
        { product: 'Product1', quantity: 2 },
        { product: 'Product2', quantity: 3 },
      ];

      sinon.stub(Cart, 'find').resolves(cartItems);

      await cartController.getItemsInCart(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(
        res.json.calledOnceWith({
          status: 'success',
          data: { cart: cartItems },
        })
      ).to.be.true;
    });

    it('should handle database errors in getItemsInCart', async () => {
      const errorMessage = 'Database error';
      sinon.stub(Cart, 'find').rejects(new Error(errorMessage));

      await cartController.getItemsInCart(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.an.instanceOf(Error);
      expect(next.firstCall.args[0].message).to.equal(errorMessage);
    });
  });

  describe('addItemsInCart', () => {
    it('should add items to the cart successfully', async () => {
      const product = { name: 'Product1', quantity: 10, price: 50 };
      const cartItem = { product: 'Product1', quantity: 1, price: 50, plateNumber: 'None', save: sinon.stub().resolves() };

      req.body = { product: 'Product1', quantity: 1, price: 50 };

      sinon.stub(Product, 'findOne').resolves(product);
      sinon.stub(Cart, 'findOne').resolves(cartItem);

      await cartController.addItemsInCart(req, res, next);

      expect(cartItem.save.calledOnce).to.be.true;
      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(
        res.json.calledOnceWith({
          status: 'success',
          data: { cart: cartItem },
        })
      ).to.be.true;
    });

    it('should not add items to the cart if not enough stock', async () => {
      const product = { name: 'Product1', quantity: 2, price: 50 };
      const cartItem = { product: 'Product1', quantity: 1, price: 50, plateNumber: 'None' };

      req.body = { product: 'Product1', quantity: 3, price: 150 };

      sinon.stub(Product, 'findOne').resolves(product);
      sinon.stub(Cart, 'findOne').resolves(cartItem);

      await cartController.addItemsInCart(req, res, next);

      expect(res.status.calledOnceWith(400)).to.be.true;
      expect(
        res.json.calledOnceWith({
          status: 'error',
          message: 'Not enough stock for this product',
        })
      ).to.be.true;
    });

    it('should create a new cart item if product not in cart', async () => {
      const product = { name: 'Product1', quantity: 10, price: 50 };
      const newCartItem = { product: 'Product1', quantity: 1, price: 50 };

      req.body = { product: 'Product1', quantity: 1, price: 50 };

      sinon.stub(Product, 'findOne').resolves(product);
      sinon.stub(Cart, 'findOne').resolves(null);
      sinon.stub(Cart, 'create').resolves(newCartItem);

      await cartController.addItemsInCart(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(
        res.json.calledOnceWith({
          status: 'success',
          data: { cart: newCartItem },
        })
      ).to.be.true;
    });

    it('should handle database errors in addItemsInCart', async () => {
      const errorMessage = 'Database error';
      sinon.stub(Cart, 'findOne').rejects(new Error(errorMessage));

      await cartController.addItemsInCart(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.an.instanceOf(Error);
      expect(next.firstCall.args[0].message).to.equal(errorMessage);
    });
  });

  describe('removeItemInCart', () => {
    it('should remove an item from the cart successfully', async () => {
      const cartItem = { _id: 'productId123' };

      req.params.productId = 'productId123';

      sinon.stub(Cart, 'findByIdAndDelete').resolves(cartItem);

      await cartController.removeItemInCart(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(
        res.json.calledOnceWith({
          status: 'success',
          data: null,
        })
      ).to.be.true;
    });

    it('should handle errors when item not found in cart', async () => {
      req.params.productId = 'nonExistentId';

      sinon.stub(Cart, 'findByIdAndDelete').resolves(null);

      await cartController.removeItemInCart(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.an.instanceOf(AppError);
      expect(next.firstCall.args[0].message).to.equal('No item in cart found with that id');
    });

    it('should handle database errors in removeItemInCart', async () => {
      const errorMessage = 'Database error';
      sinon.stub(Cart, 'findByIdAndDelete').rejects(new Error(errorMessage));

      await cartController.removeItemInCart(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.an.instanceOf(Error);
      expect(next.firstCall.args[0].message).to.equal(errorMessage);
    });
  });

  describe('clearCart', () => {
    it('should clear all items in the cart successfully', async () => {
      req.params.userId = 'userId123';

      const cartDeleteStub = sinon.stub(Cart, 'deleteMany').resolves();

      await cartController.clearCart(req, res, next);

      expect(cartDeleteStub.calledOnceWith({ owner: 'userId123' })).to.be.true;
      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(
        res.json.calledOnceWith({
          status: 'success',
          data: null,
        })
      ).to.be.true;
    });

    it('should handle database errors in clearCart', async () => {
      const errorMessage = 'Database error';
      sinon.stub(Cart, 'deleteMany').rejects(new Error(errorMessage));

      await cartController.clearCart(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.an.instanceOf(Error);
      expect(next.firstCall.args[0].message).to.equal(errorMessage);
    });
  });
});
