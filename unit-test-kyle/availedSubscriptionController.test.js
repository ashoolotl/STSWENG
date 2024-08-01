// unit-test-kyle/availedSubscriptionController.test.js

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
const SubscriptionAvailed = require('../models/subscriptionAvailedModel');
const availedSubscriptionController = require('../controllers/availedSubscriptionController');

describe('AvailedSubscription Controller', () => {
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
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getAllSubscriptionsAvailed', () => {
    it('should return all subscriptions availed', async () => {
      const subscriptions = [
        { id: '1', name: 'Subscription 1' },
        { id: '2', name: 'Subscription 2' },
      ];

      sinon.stub(SubscriptionAvailed, 'find').resolves(subscriptions);

      await availedSubscriptionController.getAllSubscriptionsAvailed(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(
        res.json.calledOnceWith({
          status: 'success',
          data: {
            subscriptionsAvailed: subscriptions,
          },
        })
      ).to.be.true;
    });

    it('should return empty when no subscriptions are availed', async () => {
      sinon.stub(SubscriptionAvailed, 'find').resolves([]);

      await availedSubscriptionController.getAllSubscriptionsAvailed(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(
        res.json.calledOnceWith({
          status: 'success',
          data: {
            subscriptionsAvailed: [],
          },
        })
      ).to.be.true;
    });

    it('should propagate errors to the next middleware in getAllSubscriptionsAvailed', async () => {
      const errorMessage = 'Database error';
      sinon.stub(SubscriptionAvailed, 'find').rejects(new Error(errorMessage));

      await availedSubscriptionController.getAllSubscriptionsAvailed(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.an.instanceOf(Error);
      expect(next.firstCall.args[0].message).to.equal(errorMessage);
    });
  });

  describe('getAvailedSubscriptionById', () => {
    it('should return a subscription availed by ID', async () => {
      const subscription = { id: '1', name: 'Subscription 1' };
      req.params.userId = '1';

      sinon.stub(SubscriptionAvailed, 'findById').resolves(subscription);

      await availedSubscriptionController.getAvailedSubscriptionById(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(
        res.json.calledOnceWith({
          status: 'success',
          data: {
            subscriptionUserAvailed: subscription,
          },
        })
      ).to.be.true;
    });

    it('should return null when subscription with given ID does not exist', async () => {
      req.params.userId = '999'; // Non-existent ID

      sinon.stub(SubscriptionAvailed, 'findById').resolves(null);

      await availedSubscriptionController.getAvailedSubscriptionById(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(
        res.json.calledOnceWith({
          status: 'success',
          data: {
            subscriptionUserAvailed: null,
          },
        })
      ).to.be.true;
    });

    it('should propagate errors to the next middleware in getAvailedSubscriptionById', async () => {
      const errorMessage = 'Database error';
      sinon.stub(SubscriptionAvailed, 'findById').rejects(new Error(errorMessage));

      await availedSubscriptionController.getAvailedSubscriptionById(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.an.instanceOf(Error);
      expect(next.firstCall.args[0].message).to.equal(errorMessage);
    });
  });

  describe('updateUserTokenSubscription', () => {
    it('should update and return the subscription details', async () => {
      const updatedSubscription = { id: '1', subscriptionDetails: 'Updated Details' };
      req.params.bookingId = '1';
      req.body.subscriptionDetails = 'Updated Details';

      sinon.stub(SubscriptionAvailed, 'findOneAndUpdate').resolves(updatedSubscription);

      await availedSubscriptionController.updateUserTokenSubscription(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(
        res.json.calledOnceWith({
          status: 'success',
          data: {
            updatedTokens: updatedSubscription,
          },
        })
      ).to.be.true;
    });

    it('should handle cases where no subscription is found to update', async () => {
      req.params.bookingId = '999'; // Non-existent ID
      req.body.subscriptionDetails = 'Details';

      sinon.stub(SubscriptionAvailed, 'findOneAndUpdate').resolves(null);

      await availedSubscriptionController.updateUserTokenSubscription(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(
        res.json.calledOnceWith({
          status: 'success',
          data: {
            updatedTokens: null,
          },
        })
      ).to.be.true;
    });

    it('should propagate errors to the next middleware in updateUserTokenSubscription', async () => {
      const errorMessage = 'Database error';
      sinon.stub(SubscriptionAvailed, 'findOneAndUpdate').rejects(new Error(errorMessage));

      await availedSubscriptionController.updateUserTokenSubscription(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.an.instanceOf(Error);
      expect(next.firstCall.args[0].message).to.equal(errorMessage);
    });
  });
});
