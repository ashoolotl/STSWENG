module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next); // pass the error to the global error handler // to remove the catch block
    };
};
