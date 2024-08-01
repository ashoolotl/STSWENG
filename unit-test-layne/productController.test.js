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
      const products = [
        { _id: new mongoose.Types.ObjectId(), name: 'Product 1', description: 'Description 1', price: 10, quantity: 2, image: 'image1.png' },
        { _id: new mongoose.Types.ObjectId(), name: 'Product 2', description: 'Description 2', price: 20, quantity: 3, image: 'image2.png' }
      ];
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
      const product = { _id: new mongoose.Types.ObjectId(), name: 'Product 1', description: 'Description 1', price: 10, quantity: 2, image: 'image1.png' };
      req.params.id = product._id.toString();

      sinon.stub(Product, 'findById').resolves(product);

      await productController.getProductById(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnceWith({
        status: 'success',
        data: { product },
      })).to.be.true;
    });

    it('should return null if product is not found', async () => {
      req.params.id = new mongoose.Types.ObjectId().toString(); // Non-existent ID
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
      const newProduct = { _id: new mongoose.Types.ObjectId(), name: 'New Product', description: 'New Description', price: 30, quantity: 1, image: 'new_image.png' };
      req.body = { name: 'New Product', description: 'New Description', price: 30, quantity: 1, image: 'new_image.png' };

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
      const updatedProduct = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Updated Product',
        description: 'Updated Description',
        price: 40,
        quantity: 5,
        image: 'updated_image.png',
      };
  
      req.params.id = updatedProduct._id.toString();
      req.body = {
        name: 'Updated Product',
        description: 'Updated Description',
        price: 40,
        quantity: 5,
        image: 'updated_image.png',
      };
  
      sinon.stub(Product, 'findByIdAndUpdate').resolves(updatedProduct);
  
      await productController.editProduct(req, res, next);
  
      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnceWith({
        status: 'success',
        data: { product: updatedProduct },
      })).to.be.true;
  

      Product.findByIdAndUpdate.restore();
    });

    it('should return 404 if product not found for update', async () => {
      req.params.id = new mongoose.Types.ObjectId().toString(); // Non-existent ID
      req.body = { name: 'Updated Product', description: 'Updated Description', price: 40, quantity: 5, image: 'updated_image.png' };

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
      req.params.id = new mongoose.Types.ObjectId().toString();
      req.body = { name: 'Updated Product', description: 'Updated Description', price: 40, quantity: 5, image: 'updated_image.png' };

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
      const product = { _id: new mongoose.Types.ObjectId(), name: 'Product 1', description: 'Description 1', price: 10, quantity: 10, image: 'image1.png', save: sinon.stub().resolves() };
      req.body = { name: 'Product 1', quantity: 5 };

      sinon.stub(Product, 'findOne').resolves(product);

      await productController.updateStock(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnceWith({
        status: 'success',
        data: { product },
      })).to.be.true;
      expect(product.quantity).to.equal(15); // Check if the quantity is updated correctly
    });

    it('should call next middleware if product not found', async () => {
      req.body = { name: 'Non-existent Product', quantity: 5 };

      sinon.stub(Product, 'findOne').resolves(null);

      await productController.updateStock(req, res, next);

      expect(next.calledOnce).to.be.true;
    });

    it('should return an error if stock update fails', async () => {
      const errorMessage = 'Database error';
      req.body = { name: 'Product 1', quantity: 5 };

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
