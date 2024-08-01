const { getReviewForService, createReview, editReview, deleteReview, replyToReview } = require('../controllers/reviewController');
const Service = require('../models/servicesModel');
const Review = require('../models/reviewModel');
const Reply = require('../models/replyModel');
const sinon = require('sinon');

describe('Review Controller', () => {
  const req = { params: { serviceId: '123', reviewId: 'review123' }, user: { id: 'user123' }, body: { service: 'service123', rating: 5, ratingMessage: 'Excellent!', "reply-text": "Thank you!" } };
  const res = {
    status: sinon.stub().returnsThis(),
    json: sinon.stub(),
  };
  const next = sinon.stub();

  beforeEach(() => {
    req.params.serviceId = '123';
    req.params.reviewId = 'review123';
    req.user.id = 'user123';
    req.body.service = 'service123';
    req.body.rating = 5;
    req.body.ratingMessage = 'Excellent!';
    req.body["reply-text"] = "Thank you!";
    res.status.resetHistory();
    res.json.resetHistory();
    next.resetHistory();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getReviewForService', () => {
    it('should fetch reviews successfully', async () => {
      const { expect } = await import('chai');
      const service = { name: 'Test Service' };
      const reviews = [{ user: { firstName: 'John', lastName: 'Doe' }, review: 'Great service!' }];

      sinon.stub(Service, 'findById').resolves(service);
      sinon.stub(Review, 'find').returns({
        populate: sinon.stub().resolves(reviews),
      });

      await getReviewForService(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({
        status: 'success',
        data: { reviews },
      })).to.be.true;
    });

    it('should handle errors when fetching reviews', async () => {
      const { expect } = await import('chai');
      const error = new Error('Something went wrong');
      sinon.stub(Service, 'findById').throws(error);

      await getReviewForService(req, res, next);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({
        status: 'error',
        message: 'An error occurred while fetching reviews.',
      })).to.be.true;
    });
  });

  describe('createReview', () => {
    it('should create a new review successfully', async () => {
      const { expect } = await import('chai');
      const newReview = { user: 'user123', service: 'service123', rating: 5, ratingMessage: 'Excellent!' };

      sinon.stub(Review, 'findOne').resolves(null);
      sinon.stub(Review, 'create').resolves(newReview);

      await createReview(req, res, next);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith({
        status: 'success',
        data: { review: newReview },
      })).to.be.true;
    });

    it('should not create a review if one already exists', async () => {
      const { expect } = await import('chai');
      const existingReview = { user: 'user123', service: 'service123' };

      sinon.stub(Review, 'findOne').resolves(existingReview);

      await createReview(req, res, next);

      expect(res.status.calledWith(409)).to.be.true;
      expect(res.json.calledWith({
        status: 'fail',
        message: 'You have already reviewed this service.',
      })).to.be.true;
    });

    it('should handle errors when creating a review', async () => {
      const { expect } = await import('chai');
      const error = new Error('Something went wrong');

      sinon.stub(Review, 'findOne').throws(error);

      await createReview(req, res, next);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({
        status: 'error',
        message: 'An error occurred while posting the review.',
      })).to.be.true;
    });
  });

  describe('editReview', () => {
    it('should edit a review successfully', async () => {
      const { expect } = await import('chai');
      const review = { user: 'user123', rating: 4, ratingMessage: 'Good' ,save: sinon.stub().resolves()};

      sinon.stub(Review, 'findById').resolves(review);

      await editReview(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({
        status: 'success',
        data: { review },
      })).to.be.true;
    });

    it('should not edit a review if the user is not authorized', async () => {
      const { expect } = await import('chai');
      const review = { user: 'differentUser123', rating: 4, ratingMessage: 'Good' };

      sinon.stub(Review, 'findById').resolves(review);

      await editReview(req, res, next);

      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.calledWith({
        status: 'fail',
        message: 'You are not authorized to edit this review',
      })).to.be.true;
    });

    it('should handle errors when editing a review', async () => {
      const { expect } = await import('chai');
      const error = new Error('Something went wrong');

      sinon.stub(Review, 'findById').throws(error);

      await editReview(req, res, next);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({
        status: 'error',
        message: 'An error occurred while editing the review.',
      })).to.be.true;
    });
  });

  describe('deleteReview', () => {
    it('should delete a review successfully', async () => {
      const { expect } = await import('chai');
      const review = { user: 'user123', deleteReview: sinon.stub().resolves() };

      sinon.stub(Review, 'findById').resolves(review);

      await deleteReview(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({
        status: 'success',
        message: 'Review deleted successfully',
      })).to.be.true;
    });

    it('should not delete a review if the user is not authorized', async () => {
      const { expect } = await import('chai');
      const review = { user: 'differentUser123', deleteReview: sinon.stub().resolves() };

      sinon.stub(Review, 'findById').resolves(review);

      await deleteReview(req, res, next);

      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.calledWith({
        status: 'fail',
        message: 'You are not authorized to delete this review',
      })).to.be.true;
    });

    it('should handle errors when deleting a review', async () => {
      const { expect } = await import('chai');
      const error = new Error('Something went wrong');

      sinon.stub(Review, 'findById').throws(error);

      await deleteReview(req, res, next);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({
        status: 'error',
        message: 'An error occurred while deleting the review.',
      })).to.be.true;
    });
  });

  describe('replyToReview', () => {
    it('should reply to a review successfully', async () => {
      const { expect } = await import('chai');
      const review = { replies: [], save: sinon.stub().resolves() };
      const newReply = { user: 'user123', firstName: 'John', lastName: 'Doe', review: 'review123', replyMessage: 'Thank you!' };

      sinon.stub(Review, 'findById').resolves(review);
      sinon.stub(Reply, 'create').resolves(newReply);

      await replyToReview(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({
        status: 'success',
        data: { reply: newReply },
      })).to.be.true;
    });

    it('should handle errors when replying to a review', async () => {
      const { expect } = await import('chai');
      const error = new Error('Something went wrong');

      sinon.stub(Review, 'findById').throws(error);

      await replyToReview(req, res, next);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({
        status: 'error',
        message: 'An error occurred while replying to the review.',
      })).to.be.true;
    });
  });
});

