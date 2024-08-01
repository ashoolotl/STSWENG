const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el];
        }
    });
    return newObj;
};

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

exports.getUser = catchAsync(async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        console.log('Handler getUser executed. req.params.id:', req.params.id);
        if (!user) {
            return next(new AppError('No user found with that ID', 404));
        }
        res.status(200).json({
            status: 'success',
            data: {
                user,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred.',
        });
    }
});

exports.getUserById = catchAsync(async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return next(new AppError('No user found with that ID', 404));
        }
        res.status(200).json({
            status: 'success',
            data: {
                user,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred.',
        });
    }
});

exports.getAllUser = catchAsync(async (req, res, next) => {
    try {
        const users = await User.find();

        res.status(200).json({
            status: 'success',
            results: users.length,
            data: {
                users,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred.',
        });
    }
});

exports.updateMe = catchAsync(async (req, res, next) => {
    try {
        // create error if user tried to change password

        if (req.body.password || req.body.passwordConfirm) {
            return next(
                new AppError(
                    'This route is not for password updates. Please use /updateMyPassword',
                    400
                )
            );
        }
        // filter out field names that are not allowed to be updated
        const filteredBody = filterObj(req.body, 'name', 'email');
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            filteredBody,
            {
                new: true,
                runValidators: true,
            }
        );
        // filter the update me to fields only allowed to update

        res.status(200).json({
            status: 'success',
            data: {
                user: updatedUser,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred.',
        });
    }
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, { active: false });
        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred.',
        });
    }
});
