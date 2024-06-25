// Dependencies
const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const AppError = require("./utils/appError");
const GlobalErrorHandler = require("./controllers/errorController");
const helpers = require('handlebars-helpers')();


// Routes
const userRouter = require("./routes/userRoutes");
const vehicleClassificationRouter = require("./routes/vehicleClassificationRoutes");
const serviceRouter = require("./routes/serviceRoutes");
const subscriptionRouter = require("./routes/subscriptionRoutes");
const viewRouter = require("./routes/viewRoutes");
const vehicleRouter = require("./routes/vehicleRoutes");
const cartRouter = require("./routes/cartRoutes");
const bookingRouter = require("./routes/bookingRoutes");
const bookingController = require("./controllers/bookingController");
const serviceAvailedRouter = require("./routes/serviceAvailedRoutes");
const subscriptionAvailedRouter = require("./routes/subscriptionAvailedroutes");
const bookingSubscriptionRouter = require("./routes/bookingSubscriptionRoutes");

// Express App
const app = express();

// Global Middleware
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Special case for raw JSON for webhooks
app.post("/webhook-checkout", express.raw({ type: "application/json" }), bookingController.webhookCheckout);
app.post("/webhook-subscription", express.raw({ type: "application/json" }), bookingController.webhookIsStillSubscribed);

// View Engine Configuration
app.engine(
  "hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayout: false,
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
    helpers: helpers,
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// API Routes
app.use("/", viewRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/vehicle-classifications", vehicleClassificationRouter);
app.use("/api/v1/services", serviceRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/vehicles", vehicleRouter);
app.use("/api/v1/carts", cartRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/servicesAvailed", serviceAvailedRouter);
app.use("/api/v1/bookings-subscription", bookingSubscriptionRouter);
app.use("/api/v1/subscriptionsAvailed", subscriptionAvailedRouter);

// Catch-all for unhandled routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Error Handling
app.use(GlobalErrorHandler);

// Export App
module.exports = app;
