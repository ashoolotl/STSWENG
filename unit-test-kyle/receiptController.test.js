// receiptController.test.js

const sinon = require('sinon');
const { describe, it, before, beforeEach, afterEach } = require('mocha');
const Receipt = require('../models/receiptModel.js');
const receiptController = require('../controllers/receiptController');

// Dynamically import chai for ESM support
let chai, expect;
before(async () => {
  chai = await import('chai');
  expect = chai.expect;
});

describe('Receipt Controller', () => {
  let req, res, next;

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

    // Stub console.error to suppress error logs
    sinon.stub(console, 'error');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('createReceipt', () => {
    it('should create a new receipt', async () => {
      const newReceipt = {
        _id: 'receiptId',
        owner: 'userId',
        amount: 100,
        date: new Date(),
      };

      sinon.stub(Receipt, 'create').resolves(newReceipt);

      req.body = newReceipt;

      await receiptController.createReceipt(req, res, next);

      expect(res.status.calledOnceWith(201)).to.be.true;
      expect(res.json.calledOnceWith({
        status: 'success',
        data: {
          receipt: newReceipt,
          id: newReceipt._id,
        },
      })).to.be.true;
    });

    it('should handle errors during receipt creation', async () => {
      const errorMessage = 'An error occurred.';
      sinon.stub(Receipt, 'create').rejects(new Error(errorMessage));

      await receiptController.createReceipt(req, res, next);

      expect(res.status.calledOnceWith(400)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0].message).to.equal(errorMessage);
    });
  });

  describe('getReceiptById', () => {
    it('should get a receipt by ID', async () => {
      const receipt = {
        _id: 'receiptId',
        owner: 'userId',
        amount: 100,
      };
  
      sinon.stub(Receipt, 'findById').resolves(receipt);
  
      req.params.id = 'receiptId';
  
      await receiptController.getReceiptById(req, res, next);
  
      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnceWith({
        status: 'success',
        data: {
          receipt,
        },
      })).to.be.true;
    });
  
    it('should return 404 when receipt is not found', async () => {
      sinon.stub(Receipt, 'findById').resolves(null);
  
      req.params.id = 'nonexistentReceiptId';
  
      await receiptController.getReceiptById(req, res, next);
  
      expect(res.status.calledOnceWith(404)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0].message).to.equal('Receipt not found.'); // Check for specific message
    });
  
    it('should handle errors when fetching a receipt by ID', async () => {
      const errorMessage = 'An error occurred.';
      sinon.stub(Receipt, 'findById').rejects(new Error(errorMessage));
  
      req.params.id = 'receiptId';
  
      await receiptController.getReceiptById(req, res, next);
  
      expect(res.status.calledOnceWith(404)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0].message).to.equal(errorMessage);
    });
  });
  

  describe('getAllReceiptsOfUser', () => {
    it('should get all receipts for a user', async () => {
      const receipts = [
        { _id: 'receiptId1', owner: 'userId', amount: 100 },
        { _id: 'receiptId2', owner: 'userId', amount: 200 },
      ];

      sinon.stub(Receipt, 'find').resolves(receipts);

      req.params.userId = 'userId';

      await receiptController.getAllReceiptsOfUser(req, res, next);

      expect(res.status.calledOnceWith(201)).to.be.true;
      expect(res.json.calledOnceWith({
        status: 'success',
        data: {
          receipts,
        },
      })).to.be.true;
    });

    it('should return empty array if user has no receipts', async () => {
      sinon.stub(Receipt, 'find').resolves([]);

      req.params.userId = 'userId';

      await receiptController.getAllReceiptsOfUser(req, res, next);

      expect(res.status.calledOnceWith(201)).to.be.true;
      expect(res.json.calledOnceWith({
        status: 'success',
        data: {
          receipts: [],
        },
      })).to.be.true;
    });

    it('should handle errors during fetching receipts for a user', async () => {
      const errorMessage = 'An error occurred.';
      sinon.stub(Receipt, 'find').rejects(new Error(errorMessage));

      req.params.userId = 'userId';

      await receiptController.getAllReceiptsOfUser(req, res, next);

      expect(res.status.calledOnceWith(404)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0].message).to.equal(errorMessage);
    });
  });

  describe('getAllReceipts', () => {
    it('should get all receipts', async () => {
      const allReceipts = [
        { _id: 'receiptId1', owner: 'userId', amount: 100 },
        { _id: 'receiptId2', owner: 'userId2', amount: 200 },
      ];

      sinon.stub(Receipt, 'find').resolves(allReceipts);

      await receiptController.getAllReceipts(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnceWith({
        status: 'success',
        data: {
          receipts: allReceipts,
        },
      })).to.be.true;
    });

    it('should return empty array if there are no receipts', async () => {
      sinon.stub(Receipt, 'find').resolves([]);

      await receiptController.getAllReceipts(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnceWith({
        status: 'success',
        data: {
          receipts: [],
        },
      })).to.be.true;
    });

    it('should handle errors during fetching all receipts', async () => {
      const errorMessage = 'An error occurred.';
      sinon.stub(Receipt, 'find').rejects(new Error(errorMessage));

      await receiptController.getAllReceipts(req, res, next);

      expect(res.status.calledOnceWith(404)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0].message).to.equal(errorMessage);
    });
  });
});
