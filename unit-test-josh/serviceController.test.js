const sinon = require('sinon');
const { describe, it, before, beforeEach, afterEach } = require('mocha');
const Service = require('../models/servicesModel');
const serviceController = require('../controllers/serviceController');

// Dynamically import chai for ESM support
let chai, expect;
before(async () => {
  chai = await import('chai');
  expect = chai.expect;
});

describe('Service Controller', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getAllServices', () => {
    it('should return all services', async () => {
      const req = {};
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };

      const services = [{ name: 'Service1' }, { name: 'Service2' }];
      sandbox.stub(Service, 'find').returns({
        populate: sinon.stub().resolves(services)
      });

      await serviceController.getAllServices(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({
        status: 'success',
        results: services.length,
        data: { services }
      })).to.be.true;
    });
  });

  // Add more tests for other functions here
  describe('createService', () => {
    it('should create a new service', async () => {
      const req = {
        body: {
          name: 'New Service',
          description: 'Service Description',
          duration: 60,
          prices: JSON.stringify([{ vehicleClassification: 'CAR', price: 100 }])
        },
        file: { filename: 'service.jpeg' }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };
      const next = sinon.stub();

      const lastService = { index: 1 };
      sandbox.stub(Service, 'findOne').resolves(lastService);
      sandbox.stub(Service, 'create').resolves(req.body);

      await serviceController.createService(req, res, next);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith({
        status: 'success',
        data: { services: req.body }
      })).to.be.true;
    });

    it('should handle invalid JSON format for prices', async () => {
      const req = {
        body: {
          name: 'New Service',
          description: 'Service Description',
          duration: 60,
          prices: 'invalid JSON'
        },
        file: { filename: 'service.jpeg' }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };
      const next = sinon.stub();

      await serviceController.createService(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.args[0][0]).to.be.an('error');
      expect(next.args[0][0].message).to.equal('Invalid JSON format for prices');
    });
  });
});