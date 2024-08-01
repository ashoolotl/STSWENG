const sinon = require('sinon');
const { describe, it, before, beforeEach, afterEach } = require('mocha');
const Vehicle = require("../models/vehicleModel");
const User = require("../models/userModel");
const vehicleController = require("../controllers/vehicleController");
const catchAsync = require("../utils/catchAsync");

// Dynamically import chai for ESM support
let chai, expect;
before(async () => {
  chai = await import('chai');
  expect = chai.expect;
});

describe('Vehicle Controller', () => {
  let req, res, next, sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = { body: {}, params: {} };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis()
    };
    next = sinon.stub();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getAllVehicle', () => {
    it('should return all vehicles', async () => {
      const vehicles = [{ id: 1, name: 'Car1' }, { id: 2, name: 'Car2' }];
      sandbox.stub(Vehicle, 'find').returns({
        populate: sinon.stub().resolves(vehicles)
      });

      await vehicleController.getAllVehicle(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({
        status: "success",
        length: vehicles.length,
        data: { vehicles }
      })).to.be.true;
    });
  });

  describe('createVehicle', () => {
    it('should create a new vehicle', async () => {
      const vehicle = { id: 1, name: 'Car1' };
      req.body = vehicle;
      sandbox.stub(Vehicle, 'create').resolves(vehicle);

      await vehicleController.createVehicle(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({
        status: "success",
        data: { vehicle }
      })).to.be.true;
    });
  });
  describe('getVehicleByOwner', () => {
    it('should return vehicles by owner ID', async () => {
      const vehicles = [{ id: 1, name: 'Car1', owner: 'ownerId' }];
      req.params.ownerId = 'ownerId';
      sandbox.stub(Vehicle, 'find').resolves(vehicles);

      await vehicleController.getVehicleByOwner(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({
        status: "success",
        data: { vehicle: vehicles }
      })).to.be.true;
    });
  });
  describe('updateVehicleStatus', () => {
    it('should update the vehicle status and return the updated vehicle', async () => {
      const vehicleId = 'vehicleId';
      const updatedVehicle = { id: vehicleId, status: 'updatedStatus', lastService: 'updatedDate' };
      req.params.vehicleId = vehicleId;
      req.body = { status: 'updatedStatus', lastService: 'updatedDate' };
      sandbox.stub(Vehicle, 'findByIdAndUpdate').resolves(updatedVehicle);

      await vehicleController.updateVehicleStatus(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({
        status: "success",
        data: { booking: updatedVehicle }
      })).to.be.true;
    });
  });
  describe('updateVehicleStatusByPlateNumber', () => {
    it('should update the vehicle status by plate number and return the updated vehicle', async () => {
      const plateNumber = 'ABC123';
      const updatedVehicle = { id: 'vehicleId', plateNumber, status: 'updatedStatus', lastService: 'updatedDate' };
      req.params.plateNumber = plateNumber;
      req.body = { status: 'updatedStatus', lastService: 'updatedDate' };
      sandbox.stub(Vehicle, 'findOneAndUpdate').resolves(updatedVehicle);

      await vehicleController.updateVehicleStatusByPlateNumber(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({
        status: "success",
        data: { booking: updatedVehicle }
      })).to.be.true;
    });

    it('should skip update if plate number is null', async () => {
      req.params.plateNumber = null;

      await vehicleController.updateVehicleStatusByPlateNumber(req, res, next);

      expect(res.status.called).to.be.false;
      expect(res.json.called).to.be.false;
    });
  });
  describe('getVehicleById', () => {
    it('should return the vehicle by plate number', async () => {
      const plateNumber = 'ABC123';
      const vehicle = { id: 'vehicleId', plateNumber, status: 'active' };
      req.params.plateNumber = plateNumber;
      sandbox.stub(Vehicle, 'find').resolves([vehicle]);

      await vehicleController.getVehicleById(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({
        status: "success",
        data: { vehicle: [vehicle] }
      })).to.be.true;
    });
  });
  describe('getVehicleStatusByPlateNumber', () => {
    it('should return the vehicle status by plate number', async () => {
      const plateNumber = 'ABC123';
      const vehicle = { id: 'vehicleId', plateNumber, status: 'active' };
      req.params.plateNumber = plateNumber;
      sandbox.stub(Vehicle, 'find').resolves([vehicle]);
  
      await vehicleController.getVehicleStatusByPlateNumber(req, res, next);
  
      console.log('res.status called with:', res.status.args);
      console.log('res.json called with:', res.json.args);
  
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({
        status: "success",
        data: { vehicle: vehicle.status, }
      })).to.be.true;
    });
  });

});