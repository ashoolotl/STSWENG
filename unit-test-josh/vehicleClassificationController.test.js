const sinon = require('sinon');
const { describe, it, before, beforeEach, afterEach } = require('mocha');
const VehicleClassification = require('../models/vehicleClassificationModel');
const vehicleClassificationController = require('../controllers/vehicleClassificationController');
const AppError = require('../utils/appError');

// Dynamically import chai for ESM support
let chai, expect;
before(async () => {
  chai = await import('chai');
  expect = chai.expect;
});

describe('Vehicle Classification Controller', () => {
  let req, res, next, sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = {
      body: {},
      file: null,
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    next = sinon.stub();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('createClassification', () => {
    it('should create a new classification with a default image', async () => {
      const newClassification = { name: 'Test Classification', photo: 'DEFAULT.jpeg' };
      sandbox.stub(VehicleClassification, 'create').resolves(newClassification);

      req.body.name = 'Test Classification';

      await vehicleClassificationController.createClassification(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({
        status: 'success',
        data: {
          vehicleClassification: newClassification,
        },
      })).to.be.true;
    });

    it('should create a new classification with an uploaded image', async () => {
      const newClassification = { name: 'Test Classification', photo: 'uploaded_image.jpeg' };
      sandbox.stub(VehicleClassification, 'create').resolves(newClassification);

      req.body.name = 'Test Classification';
      req.file = { filename: 'uploaded_image.jpeg' };

      await vehicleClassificationController.createClassification(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({
        status: 'success',
        data: {
          vehicleClassification: newClassification,
        },
      })).to.be.true;
    });
  });
  describe('getAllClassification', () => {
    it('should return all classifications', async () => {
      const classifications = [
        { name: 'Classification 1' },
        { name: 'Classification 2' },
      ];
      sandbox.stub(VehicleClassification, 'find').resolves(classifications);

      await vehicleClassificationController.getAllClassification(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({
        status: 'Success',
        results: classifications.length,
        data: {
          vehicleClassification: classifications,
        },
      })).to.be.true;
    });
  });
  describe('validateVehicleClassificationData', () => {
    it('should proceed to next middleware for POST request', async () => {
      req.method = 'POST';
      await vehicleClassificationController.validateVehicleClassificationData(req, res, next);
      expect(next.calledOnce).to.be.true;
    });

    it('should proceed to next middleware for PATCH request', async () => {
      req.method = 'PATCH';
      await vehicleClassificationController.validateVehicleClassificationData(req, res, next);
      expect(next.calledOnce).to.be.true;
    });

    it('should return an error if vehicle classification is not found', async () => {
      req.method = 'PUT';
      req.params = { classificationId: '123' };
      sandbox.stub(VehicleClassification, 'findById').resolves(null);

      await vehicleClassificationController.validateVehicleClassificationData(req, res, next);

      expect(next.calledOnce).to.be.true;
      const error = next.getCall(0).args[0];
      expect(error).to.be.instanceOf(AppError);
      expect(error.message).to.equal('There is no vehicle classification found with that id');
    });

    it('should return an error if the name already exists', async () => {
      req.method = 'PUT';
      req.params = { classificationId: '123' };
      req.body.name = 'Test Classification';
      const vehicleClassification = { _id: '123', name: 'Test Classification' };
      const allVehicleClassifications = [
        { _id: '124', name: 'Test Classification' },
      ];
      sandbox.stub(VehicleClassification, 'findById').resolves(vehicleClassification);
      sandbox.stub(VehicleClassification, 'find').resolves(allVehicleClassifications);

      await vehicleClassificationController.validateVehicleClassificationData(req, res, next);

      expect(next.calledOnce).to.be.true;
      const error = next.getCall(0).args[0];
      expect(error).to.be.instanceOf(AppError);
      expect(error.message).to.equal('The TEST CLASSIFICATION vehicle classification is already registered. Please choose another name.');
    });

    it('should proceed to next middleware if the name is unique', async () => {
      req.method = 'PUT';
      req.params = { classificationId: '123' };
      req.body.name = 'Unique Classification';
      const vehicleClassification = { _id: '123', name: 'Test Classification' };
      const allVehicleClassifications = [
        { _id: '124', name: 'Another Classification' },
      ];
      sandbox.stub(VehicleClassification, 'findById').resolves(vehicleClassification);
      sandbox.stub(VehicleClassification, 'find').resolves(allVehicleClassifications);

      await vehicleClassificationController.validateVehicleClassificationData(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.calledWith()).to.be.true;
    });
  });
});