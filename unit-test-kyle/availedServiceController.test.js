// unit-test-kyle/availedServiceController.test.js

const sinon = require('sinon');
const mongoose = require('mongoose');
const { describe, it, beforeEach, afterEach } = require('mocha');

// Dynamically import chai for ESM support
let chai, expect;
(async () => {
  chai = await import('chai');
  expect = chai.expect;
})();

// Import CommonJS modules
const ServiceAvailed = require('../models/serviceAvailedModel');
const serviceAvailedController = require('../controllers/availedServiceController');

describe('ServiceAvailed Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {},
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

    it('should handle errors properly', async () => {
      // Simulate a database error
      sinon.stub(ServiceAvailed, 'find').rejects(new Error('Database error'));

      await serviceAvailedController.getAllServiceAvailed(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.an.instanceOf(Error);
      expect(next.firstCall.args[0].message).to.equal('Database error');
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

    it('should handle errors properly', async () => {
      // Simulate a database error
      sinon.stub(ServiceAvailed, 'findById').rejects(new Error('Database error'));

      await serviceAvailedController.getAvailedServiceById(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.an.instanceOf(Error);
      expect(next.firstCall.args[0].message).to.equal('Database error');
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

    it('should handle errors properly', async () => {
      // Simulate a database error
      sinon.stub(ServiceAvailed, 'findOneAndDelete').rejects(new Error('Database error'));

      await serviceAvailedController.deleteAvailedService(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.an.instanceOf(Error);
      expect(next.firstCall.args[0].message).to.equal('Database error');
    });
  });
});
