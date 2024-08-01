const { describe, it, beforeEach, afterEach } = require('mocha');
const sinon = require('sinon');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Cart = require('../models/cartModel');
const Booking = require('../models/bookingModel');
const bookingController = require('../controllers/bookingController');

describe('Booking Controller', () => {
  let req, res, next;
  let chai, expect;

  before(async () => {
    // Dynamically import chai and destructure the expect function
    ({ expect } = await import('chai'));
  });

  beforeEach(() => {
    req = {
      user: { _id: 'user123', email: 'test@example.com' },
      params: {},
      protocol: 'http',
      get: sinon.stub().returns('localhost'),
      body: {}
    };

    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
      send: sinon.stub()
    };

    next = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getCheckoutSession', () => {
    it('should create a checkout session and return it', async () => {
      const cartItems = [
        { price: 100, product: 'Product A', plateNumber: '123', description: 'Test Product' }
      ];
      sinon.stub(Cart, 'find').resolves(cartItems);
      sinon.stub(stripe.checkout.sessions, 'create').resolves({ id: 'session_id' });

      await bookingController.getCheckoutSession(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(
        res.json.calledOnceWith({
          status: 'success',
          session: { id: 'session_id' }
        })
      ).to.be.true;
    });

    it('should handle errors when creating checkout session', async () => {
      sinon.stub(Cart, 'find').rejects(new Error('Database error'));

      await bookingController.getCheckoutSession(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.an.instanceOf(Error);
      expect(next.firstCall.args[0].message).to.equal('Database error');
    });
  });

  describe('webhookCheckout', () => {
    it('should handle successful checkout event', async () => {
      const sig = 'test_signature';
      req.headers = { 'stripe-signature': sig };
      req.body = { data: { object: { payment_intent: 'pi_test' } } };

      sinon.stub(stripe.webhooks, 'constructEvent').returns({
        type: 'checkout.session.completed',
        data: { object: { payment_intent: 'pi_test' } }
      });

      await bookingController.webhookCheckout(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(
        res.json.calledOnceWith({ received: true })
      ).to.be.true;
    });

    it('should handle errors when validating webhook signature', async () => {
      req.headers = { 'stripe-signature': 'invalid_signature' };
      req.body = {};

      sinon.stub(stripe.webhooks, 'constructEvent').throws(new Error('Invalid signature'));

      await bookingController.webhookCheckout(req, res, next);

      expect(res.status.calledOnceWith(400)).to.be.true;
      expect(res.send.calledOnceWith('Webhook Error: Invalid signature')).to.be.true;
    });
  });

  describe('createBookingCheckout', () => {
    it('should create bookings and clear cart items', async () => {
      const session = { client_reference_id: 'user123', payment_intent: 'pi_test' };
      const carts = [
        { product: 'Product A', classification: 'Class A', plateNumber: '123' }
      ];
      sinon.stub(Cart, 'find').resolves(carts);
      sinon.stub(Booking, 'create').resolves({ _id: 'booking123' });
      sinon.stub(bookingController, 'generateTokenForUser').resolves();
      sinon.stub(bookingController, 'deleteItemsInCart').resolves();

      await bookingController.createBookingCheckout(session);

      expect(Booking.create.calledOnce).to.be.true;
      expect(Cart.deleteMany.calledOnce).to.be.true;
    });

    it('should handle errors during booking creation', async () => {
      const session = { client_reference_id: 'user123' };
      sinon.stub(Cart, 'find').rejects(new Error('Database error'));

      await bookingController.createBookingCheckout(session);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.an.instanceOf(Error);
      expect(next.firstCall.args[0].message).to.equal('Database error');
    });
  });

  describe('deleteItemsInCart', () => {
    it('should delete cart items', async () => {
      const session = { client_reference_id: 'user123' };

      await bookingController.deleteItemsInCart(session);

      expect(Cart.deleteMany.calledOnceWith({ owner: 'user123' })).to.be.true;
    });

    it('should handle errors during cart item deletion', async () => {
      const session = { client_reference_id: 'user123' };
      sinon.stub(Cart, 'deleteMany').rejects(new Error('Database error'));

      await bookingController.deleteItemsInCart(session);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.an.instanceOf(Error);
      expect(next.firstCall.args[0].message).to.equal('Database error');
    });
  });
});
