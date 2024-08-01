// unit-test-kyle/userController.test.js

const sinon = require('sinon');
const { describe, it, before, beforeEach, afterEach } = require('mocha');
const User = require('../models/userModel');
const userController = require('../controllers/userController');

// Dynamically import chai
let chai, expect;
before(async () => {
  chai = await import('chai');
  expect = chai.expect;
});

describe('User Controller', () => {
  let req, res, next;
  let consoleLogStub; // Declare a variable to hold the stub for console.log

  beforeEach(() => {
    req = {
      params: {},
      body: {},
      user: { id: 'userId' },
    };

    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    next = sinon.stub();

    // Stub console.error to suppress error logs during tests
    sinon.stub(console, 'error');

    // Stub console.log to suppress output during tests
    consoleLogStub = sinon.stub(console, 'log');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getMe', () => {
    it('should set req.params.id to req.user.id and call next()', () => {
      userController.getMe(req, res, next);

      expect(req.params.id).to.equal('userId');
      expect(next.calledOnce).to.be.true;
    });
  });

  describe('getUser', () => {
    it('should get a user by ID', async () => {
      req.params.id = 'userId';
      const user = { _id: 'userId', name: 'Test User' };

      sinon.stub(User, 'findById').resolves(user);

      await userController.getUser(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(
        res.json.calledOnceWith({
          status: 'success',
          data: { user },
        })
      ).to.be.true;
    });

    it('should catch errors when user is not found', async () => {
      req.params.id = 'nonexistentId';

      sinon.stub(User, 'findById').resolves(null);

      await userController.getUser(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.an.instanceOf(Error);
      expect(next.firstCall.args[0].message).to.equal('No user found with that ID');
    });

    it('should catch database errors', async () => {
      const errorMessage = 'Database error';
      sinon.stub(User, 'findById').rejects(new Error(errorMessage));

      req.params.id = 'userId';

      await userController.getUser(req, res, next);

      // Check if res.status was called with 500
      expect(res.status.calledOnceWith(500)).to.be.true;

      // Check if res.json was called with the correct error message
      expect(
        res.json.calledOnceWith({
          status: 'error',
          message: 'An error occurred.',
        })
      ).to.be.true;
    });
  });

  describe('getUserById', () => {
    it('should get a user by userId', async () => {
      req.params.userId = 'userId';
      const user = { _id: 'userId', name: 'Test User' };

      sinon.stub(User, 'findById').resolves(user);

      await userController.getUserById(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(
        res.json.calledOnceWith({
          status: 'success',
          data: { user },
        })
      ).to.be.true;
    });

    it('should catch errors when user is not found by userId', async () => {
      req.params.userId = 'nonexistentId';

      sinon.stub(User, 'findById').resolves(null);

      await userController.getUserById(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.an.instanceOf(Error);
      expect(next.firstCall.args[0].message).to.equal('No user found with that ID');
    });

    it('should catch database errors by userId', async () => {
      const errorMessage = 'Database error';
      sinon.stub(User, 'findById').rejects(new Error(errorMessage));

      req.params.userId = 'userId';

      await userController.getUserById(req, res, next);

      // Check if res.status was called with 500
      expect(res.status.calledOnceWith(500)).to.be.true;

      // Check if res.json was called with the correct error message
      expect(
        res.json.calledOnceWith({
          status: 'error',
          message: 'An error occurred.',
        })
      ).to.be.true;
    });
  });

  describe('getAllUser', () => {
    it('should get all users', async () => {
      const users = [
        { _id: 'userId1', name: 'User 1' },
        { _id: 'userId2', name: 'User 2' },
      ];

      sinon.stub(User, 'find').resolves(users);

      await userController.getAllUser(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(
        res.json.calledOnceWith({
          status: 'success',
          results: users.length,
          data: { users },
        })
      ).to.be.true;
    });

    it('should catch errors during fetching all users', async () => {
      const errorMessage = 'Database error';
      sinon.stub(User, 'find').rejects(new Error(errorMessage));

      await userController.getAllUser(req, res, next);

      // Check if res.status was called with 500
      expect(res.status.calledOnceWith(500)).to.be.true;

      // Check if res.json was called with the correct error message
      expect(
        res.json.calledOnceWith({
          status: 'error',
          message: 'An error occurred.',
        })
      ).to.be.true;
    });
  });

  describe('updateMe', () => {
    it('should update user details', async () => {
      req.user.id = 'userId';
      req.body = { name: 'Updated User', email: 'updated@example.com' };

      const updatedUser = { _id: 'userId', name: req.body.name, email: req.body.email };

      sinon.stub(User, 'findByIdAndUpdate').resolves(updatedUser);

      await userController.updateMe(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(
        res.json.calledOnceWith({
          status: 'success',
          data: { user: updatedUser },
        })
      ).to.be.true;
    });

    it('should catch errors when trying to update password', async () => {
      req.body = { password: 'newPassword', passwordConfirm: 'newPassword' };

      await userController.updateMe(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.an.instanceOf(Error);
      expect(next.firstCall.args[0].message).to.equal(
        'This route is not for password updates. Please use /updateMyPassword'
      );
    });

    it('should catch errors during user update', async () => {
      const errorMessage = 'Update error';
      sinon.stub(User, 'findByIdAndUpdate').rejects(new Error(errorMessage));

      req.user.id = 'userId';
      req.body = { name: 'Updated User', email: 'updated@example.com' };

      await userController.updateMe(req, res, next);

      // Check if res.status was called with 500
      expect(res.status.calledOnceWith(500)).to.be.true;

      // Check if res.json was called with the correct error message
      expect(
        res.json.calledOnceWith({
          status: 'error',
          message: 'An error occurred.',
        })
      ).to.be.true;
    });
  });

  describe('deleteMe', () => {
    it('should deactivate the user account', async () => {
      req.user.id = 'userId';

      sinon.stub(User, 'findByIdAndUpdate').resolves();

      await userController.deleteMe(req, res, next);

      expect(res.status.calledOnceWith(204)).to.be.true;
      expect(
        res.json.calledOnceWith({
          status: 'success',
          data: null,
        })
      ).to.be.true;
    });

    it('should catch errors during user deactivation', async () => {
      const errorMessage = 'Deactivation error';
      sinon.stub(User, 'findByIdAndUpdate').rejects(new Error(errorMessage));

      req.user.id = 'userId';

      await userController.deleteMe(req, res, next);

      // Check if res.status was called with 500
      expect(res.status.calledOnceWith(500)).to.be.true;

      // Check if res.json was called with the correct error message
      expect(
        res.json.calledOnceWith({
          status: 'error',
          message: 'An error occurred.',
        })
      ).to.be.true;
    });
  });
});

