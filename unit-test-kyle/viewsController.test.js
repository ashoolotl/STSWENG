// unit-test-kyle/viewsController.test.js

const sinon = require("sinon");
const { describe, it, before, beforeEach, afterEach } = require("mocha");

const User = require("../models/userModel");
const Vehicle = require("../models/vehicleModel");
const VehicleClassification = require("../models/vehicleClassificationModel");
const Service = require("../models/servicesModel");
const Subscription = require("../models/subscriptionModel");
const Cart = require("../models/cartModel");
const ServiceAvailed = require("../models/serviceAvailedModel");
const Review = require("../models/reviewModel");
const Product = require("../models/productModel");
const Receipt = require("../models/receiptModel");
const viewsController = require("../controllers/viewsController");

let chai, expect;

// Dynamically import chai
before(async () => {
  chai = await import("chai");
  expect = chai.expect;
});

describe("Views Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {},
      user: { id: "userId", role: "user" },
      body: {},
      query: {},
      headers: {},
    };

    res = {
      status: sinon.stub().returnsThis(),
      render: sinon.stub(),
      locals: { user: { id: "userId", role: "user" } },
    };

    next = sinon.stub();

    sinon.stub(console, "log"); // Suppress console logs during testing
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("getLoginForm", () => {
    it("should render the login form", () => {
      viewsController.getLoginForm(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(
        res.render.calledOnceWith("login", { title: "Log into your account" })
      ).to.be.true;
    });
  });

  describe("getHomepage", () => {
    it("should render the homepage", () => {
      viewsController.getHomepage(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.render.calledOnceWith("homepage")).to.be.true;
    });
  });

  describe("getAdminDashboard", () => {
    it("should render the admin dashboard", async () => {
      const vehicles = [
        { _id: "vehicle1", owner: { lastName: "Doe", firstName: "John" } },
      ];
      const receipts = [
        {
          products: [{ name: "Product1", quantity: 2, price: 10 }],
        },
      ];

      sinon.stub(Vehicle, "find").returns({
        populate: sinon.stub().resolves(vehicles),
      });
      sinon.stub(Receipt, "find").resolves(receipts);

      await viewsController.getAdminDashboard(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(
        res.render.calledOnceWith("adminDashboard", {
          title: "Admin Dashboard",
          allVehicles: vehicles,
          products: [
            { name: "Product1", totalQuantity: 2, totalPrice: 20 },
          ],
        })
      ).to.be.true;
    });

    it("should catch errors during admin dashboard rendering", async () => {
      const errorMessage = "Error fetching data";
      sinon.stub(Vehicle, "find").returns({
        populate: sinon.stub().rejects(new Error(errorMessage)),
      });

      await viewsController.getAdminDashboard(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.an.instanceOf(Error);
      expect(next.firstCall.args[0].message).to.equal(errorMessage);
    });
  });

  describe("getDashboard", () => {
    it("should render user dashboard", async () => {
      const vehicleClassifications = [{ name: "Sedan" }];
      const vehicles = [{ name: "Vehicle1" }];
      const serviceAvailed = [{ name: "Service1" }];
      const receipts = [
        {
          _doc: { products: [{ name: "Product1", quantity: 1 }] },
        },
      ];

      sinon.stub(VehicleClassification, "find").resolves(
        vehicleClassifications
      );
      sinon.stub(Vehicle, "find").resolves(vehicles);
      sinon.stub(ServiceAvailed, "find").resolves(serviceAvailed);
      sinon.stub(Receipt, "find").resolves(receipts);

      await viewsController.getDashboard(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(
        res.render.calledOnceWith("dashboard", {
          title: "Dashboard",
          user: req.user,
          vehicleClassifications,
          vehicles,
          serviceAvailed,
          filteredReceipts: [
            {
              _doc: { products: [{ name: "Product1", quantity: 1 }] },
              products: [{ name: "Product1", quantity: 1 }],
            },
          ],
        })
      ).to.be.true;
    });

    it("should render admin dashboard when user role is admin", async () => {
      req.user.role = "admin";
      const vehicles = [
        { _id: "vehicle1", owner: { lastName: "Doe", firstName: "John" } },
      ];
      const receipts = [
        {
          products: [{ name: "Product1", quantity: 2, price: 10 }],
        },
      ];

      sinon.stub(Vehicle, "find").returns({
        populate: sinon.stub().resolves(vehicles),
      });
      sinon.stub(Receipt, "find").resolves(receipts);

      await viewsController.getDashboard(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(
        res.render.calledOnceWith("adminDashboard", {
          title: "Admin Dashboard",
          allVehicles: vehicles,
          products: [
            { name: "Product1", totalQuantity: 2, totalPrice: 20 },
          ],
        })
      ).to.be.true;
    });

    it("should catch errors during dashboard rendering", async () => {
      req.user.role = "admin";
      const errorMessage = "Error fetching data";
      sinon.stub(Vehicle, "find").returns({
        populate: sinon.stub().rejects(new Error(errorMessage)),
      });

      await viewsController.getDashboard(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.an.instanceOf(Error);
      expect(next.firstCall.args[0].message).to.equal(errorMessage);
    });
  });

  describe("getVehicleClassifications", () => {
    it("should render vehicle classifications", async () => {
      const vehicleClassifications = [{ name: "Sedan" }];

      sinon.stub(VehicleClassification, "find").resolves(
        vehicleClassifications
      );

      await viewsController.getVehicleClassifications(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(
        res.render.calledOnceWith("vehicleClassification", {
          title: "Vehicle Classification",
          vehicleClassification: vehicleClassifications,
        })
      ).to.be.true;
    });

    it("should catch errors during vehicle classifications fetching", async () => {
      const errorMessage = "Error fetching data";
      sinon
        .stub(VehicleClassification, "find")
        .rejects(new Error(errorMessage));

      await viewsController.getVehicleClassifications(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.an.instanceOf(Error);
      expect(next.firstCall.args[0].message).to.equal(errorMessage);
    });
  });

  describe("getServices", () => {
    it("should render services", async function () {
      this.timeout(5000); // Increase timeout for async operations
      const services = [{ name: "Service1" }];
      const vehicleClassification = [{ name: "Sedan" }];

      sinon.stub(Service, "find").resolves(services);
      sinon.stub(VehicleClassification, "find").resolves(
        vehicleClassification
      );

      await viewsController.getServices(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(
        res.render.calledOnceWith("services", {
          title: "Services",
          services,
          vehicleClassification,
          user: res.locals.user,
          vehicles: undefined,
        })
      ).to.be.true;
    });

    it("should render services with user vehicles", async () => {
      res.locals.user = { id: "userId", role: "user" };
      const services = [{ name: "Service1" }];
      const vehicleClassification = [{ name: "Sedan" }];
      const vehicles = [{ name: "Vehicle1" }];

      sinon.stub(Service, "find").resolves(services);
      sinon.stub(VehicleClassification, "find").resolves(
        vehicleClassification
      );
      sinon.stub(Vehicle, "find").resolves(vehicles);

      await viewsController.getServices(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(
        res.render.calledOnceWith("services", {
          title: "Services",
          services,
          vehicleClassification,
          user: res.locals.user,
          vehicles,
        })
      ).to.be.true;
    });

    it("should catch errors during services fetching", async () => {
      const errorMessage = "Error fetching services";
      sinon.stub(Service, "find").rejects(new Error(errorMessage));

      await viewsController.getServices(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.an.instanceOf(Error);
      expect(next.firstCall.args[0].message).to.equal(errorMessage);
    });
  });

  describe("getReviews", () => {
    it("should render reviews", async () => {
      req.params.serviceName = "Service1";
      const reviews = [
        { _id: "review1", user: { lastName: "Doe", firstName: "John" } },
      ];

      sinon.stub(Review, "find").returns({
        populate: sinon.stub().resolves(reviews),
      });

      await viewsController.getReviews(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(
        res.render.calledOnceWith("reviews", {
          title: "Reviews",
          reviews,
          serviceName: "Service1",
        })
      ).to.be.true;
    });

    it("should catch errors during reviews fetching", async () => {
      const errorMessage = "Error fetching reviews";
      sinon.stub(Review, "find").returns({
        populate: sinon.stub().rejects(new Error(errorMessage)),
      });

      await viewsController.getReviews(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.an.instanceOf(Error);
      expect(next.firstCall.args[0].message).to.equal(errorMessage);
    });
  });


  describe("getRegister", () => {
    it("should render register page", async () => {
      await viewsController.getRegister(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(
        res.render.calledOnceWith("register", { title: "Create new Account" })
      ).to.be.true;
    });
  });

  describe("getCart", () => {
    it("should render cart for user", async () => {
      const cartItems = [{ _id: "cartItem1" }];

      sinon.stub(Cart, "find").resolves(cartItems);

      await viewsController.getCart(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(
        res.render.calledOnceWith("cart", {
          title: "Cart",
          cartItems,
          user: res.locals.user,
        })
      ).to.be.true;
    });

    it("should catch errors during cart fetching", async () => {
      const errorMessage = "Error fetching cart";
      sinon.stub(Cart, "find").rejects(new Error(errorMessage));

      await viewsController.getCart(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.an.instanceOf(Error);
      expect(next.firstCall.args[0].message).to.equal(errorMessage);
    });
  });

  describe("getProducts", () => {
    it("should render products", async () => {
      const products = [{ name: "Product1" }];

      sinon.stub(Product, "find").resolves(products);

      await viewsController.getProducts(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(
        res.render.calledOnceWith("product-catalog", {
          title: "Products",
          products,
        })
      ).to.be.true;
    });

    it("should catch errors during products fetching", async () => {
      const errorMessage = "Error fetching products";
      sinon.stub(Product, "find").rejects(new Error(errorMessage));

      await viewsController.getProducts(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.an.instanceOf(Error);
      expect(next.firstCall.args[0].message).to.equal(errorMessage);
    });
  });

  describe("getReceiptById", () => {
    it("should render receipt by ID", async () => {
      const receipt = { _id: "receipt1" };

      sinon.stub(Receipt, "findById").resolves(receipt);

      req.params.id = "receipt1";
      await viewsController.getReceiptById(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(
        res.render.calledOnceWith("receipt", {
          title: "Receipt",
          receipt,
        })
      ).to.be.true;
    });

    it("should catch errors during receipt fetching by ID", async () => {
      const errorMessage = "Error fetching receipt";
      sinon.stub(Receipt, "findById").rejects(new Error(errorMessage));

      await viewsController.getReceiptById(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.an.instanceOf(Error);
      expect(next.firstCall.args[0].message).to.equal(errorMessage);
    });
  });
});
