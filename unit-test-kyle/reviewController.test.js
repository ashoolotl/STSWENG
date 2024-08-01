// reviewController.test.js

const sinon = require('sinon');
const { describe, it, before, beforeEach, afterEach } = require('mocha');
const Review = require('../models/reviewModel');
const Service = require('../models/servicesModel');
const Reply = require('../models/replyModel');
const reviewController = require('../controllers/reviewController');

// Dynamically import chai for ESM support
let chai, expect;
before(async () => {
  chai = await import('chai');
  expect = chai.expect;
});

describe('Review Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
      user: {},
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

  describe('getReviewForService', () => {
    it('should return reviews for a service', async () => {
      const service = { _id: 'serviceId', name: 'Test Service' };
      const reviews = [
        {
          user: { firstName: 'John', lastName: 'Doe', _id: 'userId1' },
          rating: 5,
          ratingMessage: 'Great!',
          _id: 'reviewId1',
        },
        {
          user: { firstName: 'Jane', lastName: 'Doe', _id: 'userId2' },
          rating: 4,
          ratingMessage: 'Good',
          _id: 'reviewId2',
        },
      ];

      sinon.stub(Service, 'findById').resolves(service);
      // Simulate Review.find with populate by returning full user objects
      sinon.stub(Review, 'find').returns({
        populate: sinon.stub().resolves(reviews),
      });

      req.params.serviceId = 'serviceId';

      await reviewController.getReviewForService(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnceWith({
        status: 'success',
        data: {
          reviews,
        },
      })).to.be.true;
    });

    it('should handle errors during fetching reviews', async () => {
      req.params.serviceId = 'invalidServiceId';
      sinon.stub(Service, 'findById').rejects(new Error('Database error'));

      await reviewController.getReviewForService(req, res, next);

      expect(res.status.calledOnceWith(500)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.have.property(
        'message',
        'An error occurred while fetching reviews.'
      );
    });
  });

  describe('createReview', () => {
    it('should create a new review', async () => {
      const newReview = {
        user: 'userId',
        service: 'serviceName',
        rating: 5,
        ratingMessage: 'Great service!',
      };

      sinon.stub(Review, 'findOne').resolves(null);
      sinon.stub(Review, 'create').resolves(newReview);

      req.user.id = 'userId';
      req.body = newReview;

      await reviewController.createReview(req, res, next);

      expect(res.status.calledOnceWith(201)).to.be.true;
      expect(res.json.calledOnceWith({
        status: 'success',
        data: {
          review: newReview,
        },
      })).to.be.true;
    });

    it('should return 409 if user has already reviewed the service', async () => {
      req.user.id = 'userId';
      req.body.service = 'serviceName';
      sinon.stub(Review, 'findOne').resolves({ user: req.user.id });

      await reviewController.createReview(req, res, next);

      expect(res.status.calledOnceWith(409)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.have.property(
        'message',
        'You have already reviewed this service.'
      );
    });

    it('should handle errors during review creation', async () => {
      req.user.id = 'userId';
      req.body.service = 'serviceName';
      sinon.stub(Review, 'findOne').rejects(new Error('Database error'));

      await reviewController.createReview(req, res, next);

      expect(res.status.calledOnceWith(500)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.have.property(
        'message',
        'An error occurred while posting the review.'
      );
    });
  });

  describe('editReview', () => {
    it('should edit an existing review', async () => {
      const review = {
        _id: 'reviewId',
        user: 'userId',
        rating: 4,
        ratingMessage: 'Good service!',
        save: sinon.stub().resolves(),
      };

      sinon.stub(Review, 'findById').resolves(review);

      req.params.reviewId = 'reviewId';
      req.user.id = 'userId';
      req.body = {
        rating: 5,
        ratingMessage: 'Excellent service!',
      };

      await reviewController.editReview(req, res, next);

      expect(review.save.calledOnce).to.be.true;
      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnceWith({
        status: 'success',
        data: {
          review,
        },
      })).to.be.true;
    });

    it('should return 401 if user is not authorized to edit the review', async () => {
      req.params.reviewId = 'reviewId';
      req.user.id = 'anotherUserId';
      sinon.stub(Review, 'findById').resolves({ user: 'userId' });

      await reviewController.editReview(req, res, next);

      expect(res.status.calledOnceWith(401)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.have.property(
        'message',
        'You are not authorized to edit this review'
      );
    });

    it('should handle errors during review editing', async () => {
      req.params.reviewId = 'reviewId';
      req.user.id = 'userId';
      sinon.stub(Review, 'findById').rejects(new Error('Database error'));

      await reviewController.editReview(req, res, next);

      expect(res.status.calledOnceWith(500)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.have.property(
        'message',
        'An error occurred while editing the review.'
      );
    });
  });

  describe('deleteReview', () => {
    it('should delete a review', async () => {
      const review = {
        _id: 'reviewId',
        user: 'userId',
        deleteReview: sinon.stub().resolves(),
      };

      sinon.stub(Review, 'findById').resolves(review);

      req.params.reviewId = 'reviewId';
      req.user.id = 'userId';

      await reviewController.deleteReview(req, res, next);

      expect(review.deleteReview.calledOnce).to.be.true;
      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnceWith({
        status: 'success',
        message: 'Review deleted successfully',
      })).to.be.true;
    });

    it('should return 401 if user is not authorized to delete the review', async () => {
      req.params.reviewId = 'reviewId';
      req.user.id = 'anotherUserId';
      sinon.stub(Review, 'findById').resolves({ user: 'userId' });

      await reviewController.deleteReview(req, res, next);

      expect(res.status.calledOnceWith(401)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.have.property(
        'message',
        'You are not authorized to delete this review'
      );
    });

    it('should handle errors during review deletion', async () => {
      req.params.reviewId = 'reviewId';
      req.user.id = 'userId';
      sinon.stub(Review, 'findById').rejects(new Error('Database error'));

      await reviewController.deleteReview(req, res, next);

      expect(res.status.calledOnceWith(500)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.have.property(
        'message',
        'An error occurred while deleting the review.'
      );
    });
  });

  describe('replyToReview', () => {
    it('should reply to a review', async () => {
      const review = {
        _id: 'reviewId',
        user: 'userId',
        replies: [],
        save: sinon.stub().resolves(),
      };

      const newReply = {
        user: 'userId',
        firstName: 'John',
        lastName: 'Doe',
        review: 'reviewId',
        replyMessage: 'Thanks for your feedback!',
      };

      sinon.stub(Review, 'findById').resolves(review);
      sinon.stub(Reply, 'create').resolves(newReply);

      req.params.reviewId = 'reviewId';
      req.user.id = 'userId';
      req.user.firstName = 'John';
      req.user.lastName = 'Doe';
      req.body = { 'reply-text': 'Thanks for your feedback!' };

      await reviewController.replyToReview(req, res, next);

      expect(review.replies).to.include(newReply);
      expect(review.save.calledOnce).to.be.true;
      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnceWith({
        status: 'success',
        data: {
          reply: newReply,
        },
      })).to.be.true;
    });

    it('should handle errors during replying to a review', async () => {
      req.params.reviewId = 'reviewId';
      req.user.id = 'userId';
      sinon.stub(Review, 'findById').rejects(new Error('Database error'));

      await reviewController.replyToReview(req, res, next);

      expect(res.status.calledOnceWith(500)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.have.property(
        'message',
        'An error occurred while replying to the review.'
      );
    });
  });
});
