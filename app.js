const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
/*--------------DECLARE THE ROUTERS HERE--------------*/
const AppError = require('./utils/appError');
const GlobalErrorHandler = require('./controllers/errorController');

const userRouter = require('./routes/userRoutes');
const vehicleClassificationRouter = require('./routes/vehicleClassificationRoutes');
const serviceRouter = require('./routes/serviceRoutes');
const subscriptionRouter = require('./routes/subscriptionRoutes');
const viewRouter = require('./routes/viewRoutes');
const vehicleRouter = require('./routes/vehicleRoutes');
const cartRouter = require('./routes/cartRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const bookingController = require('./controllers/bookingController');

const serviceAvailedRouter = require('./routes/serviceAvailedRoutes');

const subscriptionAvailedRouter = require('./routes/subscriptionAvailedroutes');

const bookingSubscriptionRouter = require('./routes/bookingSubscriptionRoutes');

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// serving static files
app.use(express.static(path.join(__dirname, 'public')));

// global middle ware
// set security HTTP headers
// app.use(helmet({ contentSecurityPolicy: false }));

//development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// LIMIT REQUEST FROM API
// const limiter = rateLimit({
//     max: 200,
//     windowMs: 60 * 60 * 1000,
//     message: 'Too many request from this IP, please try again in an hour',
// });
// app.use('/api', limiter);
app.post(
    '/webhook-checkout',
    express.raw({ type: 'application/json' }),
    bookingController.webhookCheckout
);
app.post(
    '/webhook-subscription',
    express.raw({ type: 'application/json' }),
    bookingController.webhookIsStillSubscribed
);
// Body Parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
// data sanitization here against nosql query injection
app.use(mongoSanitize());
// data sanitization against XSS

// prevent parameter pollution
//app.use(hpp());

app.use((req, res, next) => {
    //console.log(req.cookies);
    next();
});

/*--------------DECLARE THE ROUTES HERE--------------*/
app.use('/', viewRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/vehicle-classifications', vehicleClassificationRouter);
app.use('/api/v1/services', serviceRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/vehicles', vehicleRouter);
app.use('/api/v1/carts', cartRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/servicesAvailed', serviceAvailedRouter);
app.use('/api/v1/bookings-subscription', bookingSubscriptionRouter);
app.use('/api/v1/subscriptionsAvailed', subscriptionAvailedRouter);

// Handle error if tried to access invalid path
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`), 404);
});

app.use(GlobalErrorHandler);
// global error handler

module.exports = app;
