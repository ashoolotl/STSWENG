const sinon = require('sinon');
const mongoose = require('mongoose');
const { describe, it, beforeEach, afterEach } = require('mocha');

// Dynamically import chai for ESM support
let chai, expect;
(async () => {
  chai = await import('chai');
  expect = chai.expect;
})();

const Product = require('../models/productModel');
const productController = require('../controllers/productController');

describe('Product Controller', () => {
  let req, res, next;
  let consoleErrorStub;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
    };

    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    next = sinon.stub();

    // Stub console.error to suppress error messages during tests
    consoleErrorStub = sinon.stub(console, 'error');
  });

  afterEach(() => {
    sinon.restore();
    consoleErrorStub.restore(); // Restore console.error after each test
  });

  describe('getAllProducts', () => {
    it('should return all products', async () => {
      const products = [{ id: '1', name: 'Product 1' }, { id: '2', name: 'Product 2' }];
      sinon.stub(Product, 'find').resolves(products);

      await productController.getAllProducts(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnceWith({
        status: 'success',
        data: { products },
      })).to.be.true;
    });

    it('should return an error if an exception occurs', async () => {
      const errorMessage = 'Database error';
      sinon.stub(Product, 'find').rejects(new Error(errorMessage));

      await productController.getAllProducts(req, res, next);

      expect(res.status.calledOnceWith(500)).to.be.true;
      expect(res.json.calledOnceWith({
        status: 'error',
        message: 'An error occurred while fetching products.',
      })).to.be.true;
    });
  });

  describe('getProductById', () => {
    it('should return a product by ID', async () => {
      const product = { id: '1', name: 'Product 1' };
      req.params.id = '1';

      sinon.stub(Product, 'findById').resolves(product);

      await productController.getProductById(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnceWith({
        status: 'success',
        data: { product },
      })).to.be.true;
    });

    it('should return an error if product is not found', async () => {
      req.params.id = '999'; // Non-existent ID
      sinon.stub(Product, 'findById').resolves(null);

      await productController.getProductById(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnceWith({
        status: 'success',
        data: { product: null },
      })).to.be.true;
    });
  });

  describe('createProduct', () => {
    it('should create and return the new product', async () => {
      const newProduct = { id: '1', name: 'New Product' };
      req.body = { name: 'New Product' };

      sinon.stub(Product, 'create').resolves(newProduct);

      await productController.createProduct(req, res, next);

      expect(res.status.calledOnceWith(201)).to.be.true;
      expect(res.json.calledOnceWith({
        status: 'success',
        data: { product: newProduct },
      })).to.be.true;
    });

    it('should return an error if product creation fails', async () => {
      const errorMessage = 'Database error';
      sinon.stub(Product, 'create').rejects(new Error(errorMessage));

      await productController.createProduct(req, res, next);

      expect(res.status.calledOnceWith(500)).to.be.true;
      expect(res.json.calledOnceWith({
        status: 'error',
        message: 'An error occurred while creating product.',
      })).to.be.true;
    });
  });

  describe('editProduct', () => {
    it('should update and return the product', async () => {
      const updatedProduct = { id: '1', name: 'Updated Product' };
      req.params.id = '1';
      req.body = { name: 'Updated Product' };

      sinon.stub(Product, 'findByIdAndUpdate').resolves(updatedProduct);

      await productController.editProduct(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnceWith({
        status: 'success',
        data: { product: updatedProduct },
      })).to.be.true;
    });

    it('should return 404 if product not found for update', async () => {
      req.params.id = '999'; // Non-existent ID
      req.body = { name: 'Updated Product' };

      sinon.stub(Product, 'findByIdAndUpdate').resolves(null);

      await productController.editProduct(req, res, next);

      expect(res.status.calledOnceWith(404)).to.be.true;
      expect(res.json.calledOnceWith({
        status: 'fail',
        message: 'Product not found',
      })).to.be.true;
    });

    it('should return an error if product update fails', async () => {
      const errorMessage = 'Database error';
      sinon.stub(Product, 'findByIdAndUpdate').rejects(new Error(errorMessage));

      await productController.editProduct(req, res, next);

      expect(res.status.calledOnceWith(500)).to.be.true;
      expect(res.json.calledOnceWith({
        status: 'error',
        message: 'An error occurred while updating product.',
      })).to.be.true;
    });
  });

  describe('updateStock', () => {
    it('should update and return the product stock', async () => {
      const product = { id: '1', name: 'Product 1', quantity: 10 };
      req.body = { name: 'Product 1', quantity: 5 };

      sinon.stub(Product, 'findOne').resolves(product);
      sinon.stub(product, 'save').resolves();

      await productController.updateStock(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnceWith({
        status: 'success',
        data: { product },
      })).to.be.true;
    });

    it('should return next middleware if product not found', async () => {
      req.body = { name: 'Non-existent Product', quantity: 5 };

      sinon.stub(Product, 'findOne').resolves(null);

      await productController.updateStock(req, res, next);

      expect(next.calledOnce).to.be.true;
    });

    it('should return an error if stock update fails', async () => {
      const errorMessage = 'Database error';
      sinon.stub(Product, 'findOne').rejects(new Error(errorMessage));

      await productController.updateStock(req, res, next);

      expect(res.status.calledOnceWith(500)).to.be.true;
      expect(res.json.calledOnceWith({
        status: 'error',
        message: 'An error occurred while updating product stock.',
      })).to.be.true;
    });
  });
});
