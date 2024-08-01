// availedServiceController.test.js

const sinon = require('sinon');
const { describe, it, before, beforeEach, afterEach } = require('mocha');
const ServiceAvailed = require('../models/serviceAvailedModel');
const serviceAvailedController = require('../controllers/availedServiceController');

// Dynamically import chai for ESM support
let chai, expect;
before(async () => {
  chai = await import('chai');
  expect = chai.expect;
});

describe('ServiceAvailed Controller', () => {
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

  describe('getAllServiceAvailed', () => {
    it('should return all services availed', async () => {
      const services = [
        { id: '1', name: 'Service 1' },
        { id: '2', name: 'Service 2' },
      ];

      sinon.stub(ServiceAvailed, 'find').resolves(services);

      await serviceAvailedController.getAllServiceAvailed(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(
        res.json.calledOnceWith({
          status: 'success',
          data: {
            serviceAvailed: services,
          },
        })
      ).to.be.true;
    });

    it('should return empty when no services are availed', async () => {
      sinon.stub(ServiceAvailed, 'find').resolves([]);

      await serviceAvailedController.getAllServiceAvailed(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(
        res.json.calledOnceWith({
          status: 'success',
          data: {
            serviceAvailed: [],
          },
        })
      ).to.be.true;
    });

    it('should handle database errors and return status 500', async () => {
      // Simulate a database error by rejecting the promise
      sinon.stub(ServiceAvailed, 'find').rejects(new Error('Database error'));

      await serviceAvailedController.getAllServiceAvailed(req, res, next);

      // Assert that the response status is 500 and contains the correct error message
      expect(res.status.calledOnceWith(500)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal({
        status: 'error',
        message: 'An error occurred.',
      });
    });

    it('should handle unexpected errors and return status 500', async () => {
      sinon.stub(ServiceAvailed, 'find').throws(new Error('Unexpected error'));

      await serviceAvailedController.getAllServiceAvailed(req, res, next);

      // Assert that the response status is 500 and contains the correct error message
      expect(res.status.calledOnceWith(500)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal({
        status: 'error',
        message: 'An error occurred.',
      });
    });
  });

  describe('getAvailedServiceById', () => {
    it('should return a service availed by ID', async () => {
      const service = { id: '1', name: 'Service 1' };
      req.params.userId = '1';

      sinon.stub(ServiceAvailed, 'findById').resolves(service);

      await serviceAvailedController.getAvailedServiceById(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(
        res.json.calledOnceWith({
          status: 'success',
          data: {
            serviceAvailed: service,
          },
        })
      ).to.be.true;
    });

    it('should return null when service with given ID does not exist', async () => {
      req.params.userId = '999'; // Non-existent ID

      sinon.stub(ServiceAvailed, 'findById').resolves(null);

      await serviceAvailedController.getAvailedServiceById(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(
        res.json.calledOnceWith({
          status: 'success',
          data: {
            serviceAvailed: null,
          },
        })
      ).to.be.true;
    });

    it('should handle database errors and return status 500', async () => {
      sinon.stub(ServiceAvailed, 'findById').rejects(new Error('Database error'));

      await serviceAvailedController.getAvailedServiceById(req, res, next);

      // Assert that the response status is 500 and contains the correct error message
      expect(res.status.calledOnceWith(500)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal({
        status: 'error',
        message: 'An error occurred.',
      });
    });

    it('should handle unexpected errors and return status 500', async () => {
      sinon.stub(ServiceAvailed, 'findById').throws(new Error('Unexpected error'));

      await serviceAvailedController.getAvailedServiceById(req, res, next);

      // Assert that the response status is 500 and contains the correct error message
      expect(res.status.calledOnceWith(500)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal({
        status: 'error',
        message: 'An error occurred.',
      });
    });
  });

  describe('deleteAvailedService', () => {
    it('should delete a service availed by booking ID', async () => {
      req.params.userId = '1';

      sinon.stub(ServiceAvailed, 'findOneAndDelete').resolves({ id: '1' });

      await serviceAvailedController.deleteAvailedService(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(
        res.json.calledOnceWith({
          status: 'success',
          data: null,
        })
      ).to.be.true;
    });

    it('should return null when no service is found to delete', async () => {
      req.params.userId = '999'; // Non-existent ID

      sinon.stub(ServiceAvailed, 'findOneAndDelete').resolves(null);

      await serviceAvailedController.deleteAvailedService(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(
        res.json.calledOnceWith({
          status: 'success',
          data: null,
        })
      ).to.be.true;
    });

    it('should handle database errors and return status 500', async () => {
      sinon.stub(ServiceAvailed, 'findOneAndDelete').rejects(new Error('Database error'));

      await serviceAvailedController.deleteAvailedService(req, res, next);

      // Assert that the response status is 500 and contains the correct error message
      expect(res.status.calledOnceWith(500)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal({
        status: 'error',
        message: 'An error occurred.',
      });
    });

    it('should handle unexpected errors and return status 500', async () => {
      sinon.stub(ServiceAvailed, 'findOneAndDelete').throws(new Error('Unexpected error'));

      await serviceAvailedController.deleteAvailedService(req, res, next);

      // Assert that the response status is 500 and contains the correct error message
      expect(res.status.calledOnceWith(500)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal({
        status: 'error',
        message: 'An error occurred.',
      });
    });
  });
});
