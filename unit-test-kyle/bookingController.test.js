// bookingController.test.js

const sinon = require('sinon');
const { describe, it, before, beforeEach, afterEach } = require('mocha');
const stripe = require('stripe')('test_secret_key'); // Mock Stripe with a test key

// Dynamically import chai for ESM support
let chai, expect;
before(async () => {
  chai = await import('chai');
  expect = chai.expect;
});

// Import CommonJS modules
const Cart = require('../models/cartModel');
const Booking = require('../models/bookingModel');
const bookingController = require('../controllers/bookingController'); // Ensure the controller is imported correctly
const stripeMock = sinon.stub(stripe.checkout.sessions, 'create');
const stripeWebhookMock = sinon.stub(stripe.webhooks, 'constructEvent');

describe('Booking Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: { userId: 'userId123' },
      body: {},
      user: {
        _id: 'userId123',
        email: 'test@example.com',
      },
      headers: {
        'stripe-signature': 'test_signature',
      },
      protocol: 'http',
      get: sinon.stub().returns('localhost'),
    };

    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
      send: sinon.stub(),
    };

    next = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getCheckoutSession', () => {
    it('should create a Stripe checkout session successfully', async () => {
      const cartItems = [
        { product: 'Product1', price: 100, description: 'Description1', plateNumber: '1234' },
        { product: 'Product2', price: 200, description: 'Description2', plateNumber: '5678' },
      ];

      sinon.stub(Cart, 'find').resolves(cartItems);

      stripeMock.resolves({
        id: 'sessionId123',
      });

      await bookingController.getCheckoutSession(req, res, next);

      expect(stripeMock.calledOnce).to.be.true;
      expect(stripeMock.firstCall.args[0]).to.have.property('customer_email', req.user.email);
      expect(stripeMock.firstCall.args[0].line_items).to.have.lengthOf(2);
      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.have.property('status', 'success');
      expect(res.json.firstCall.args[0].session).to.have.property('id', 'sessionId123');
    });

    it('should handle errors when creating a Stripe checkout session', async () => {
      const errorMessage = 'Stripe error';

      sinon.stub(Cart, 'find').rejects(new Error(errorMessage));

      await bookingController.getCheckoutSession(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.an.instanceOf(Error);
      expect(next.firstCall.args[0].message).to.equal(errorMessage);
    });
  });

  describe('webhookCheckout', () => {
    it('should handle a successful Stripe webhook event', async () => {
      const event = {
        type: 'checkout.session.completed',
        data: {
          object: {
            client_reference_id: 'userId123',
            payment_intent: 'pi_123',
          },
        },
      };

      stripeWebhookMock.returns(event);

      await bookingController.webhookCheckout(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnceWith({ received: true })).to.be.true;
    });

    it('should handle errors during webhook event construction', async () => {
      const errorMessage = 'Webhook signature verification failed';

      stripeWebhookMock.throws(new Error(errorMessage));

      await bookingController.webhookCheckout(req, res, next);

      expect(res.status.calledOnceWith(400)).to.be.true;
      expect(res.send.calledOnceWith(`Webhook Error: ${errorMessage}`)).to.be.true;
    });
  });

  describe('createBookingCheckout', () => {
    const createBookingCheckout = async (session) => {
      const owner = session.client_reference_id;
      const carts = await Cart.find({ owner: owner });

      for (const cart of carts) {
        const newBooking = await Booking.create({
          tokensAmount: 1,
          owner: owner,
          product: cart.product,
          classification: cart.classification,
          plateNumber: cart.plateNumber,
          stripeReferenceNumber: session.payment_intent,
        });
        // Assuming you have a function to generate tokens
        // generateTokenForUser(newBooking._id);  // Uncomment if applicable
      }
      await Cart.deleteMany({ owner: owner });
    };

    it('should create a booking and clear cart items', async () => {
      const session = {
        client_reference_id: 'userId123',
        payment_intent: 'pi_123',
      };

      const cartItems = [
        { product: 'Product1', classification: 'Class1', plateNumber: '1234' },
        { product: 'Product2', classification: 'Class2', plateNumber: '5678' },
      ];

      sinon.stub(Cart, 'find').resolves(cartItems);
      const bookingStub = sinon.stub(Booking, 'create').resolves();
      const cartDeleteStub = sinon.stub(Cart, 'deleteMany').resolves();

      await createBookingCheckout(session);

      expect(bookingStub.calledTwice).to.be.true;
      expect(bookingStub.firstCall.args[0]).to.include({
        owner: 'userId123',
        product: 'Product1',
        classification: 'Class1',
        plateNumber: '1234',
        stripeReferenceNumber: 'pi_123',
      });
      expect(cartDeleteStub.calledOnceWith({ owner: 'userId123' })).to.be.true;
    });

    it('should handle errors during booking creation', async () => {
      const session = {
        client_reference_id: 'userId123',
        payment_intent: 'pi_123',
      };

      sinon.stub(Cart, 'find').rejects(new Error('Database error'));

      try {
        await createBookingCheckout(session);
      } catch (error) {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('Database error');
      }
    });
  });
});
