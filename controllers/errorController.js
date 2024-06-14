const AppError = require('../utils/appError');

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

const handleDuplicateFieldsDB = (err) => {
    const value = err.keyValue.name;
    const message = `Duplicate field value: ${value}. Please use another value`;
    return new AppError(message, 400);
};
const handleJWTError = () =>
    new AppError('Invalid Token. Please login again.', 401);
const handleJWTExpiredError = () =>
    new AppError('Your token has expired! Please Log In Again', 401);
const sendErrorProd = (err, res) => {
    // operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        // programming or other unknown error
        // 1 log error to console
        console.error('Error: ', err);
        //2 send generic message
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!',
        });
    }
};
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV.includes('development')) {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV.includes('production')) {
        // operational errors
        let error = { ...err };
        if (err.code === 11000) {
            error = handleDuplicateFieldsDB(error);
        }
        if (error.name === 'JsonWebTokenError') {
            error = handleJWTError();
        }
        if (error.name === 'TokenExpiredError') {
            error = handleJWTExpiredError();
        }
        sendErrorProd(error, res);
    }
};
