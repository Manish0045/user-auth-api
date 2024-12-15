const { CustomError } = require('../middlewares/errorHandler');
const { User } = require('../models/user.model');
const { ApiResponse } = require('../middlewares/apiResponse');
const { sendActivationMail } = require('../utils/mailServices');
const { hashPassword, comparePassword, generateToken, STATUS_CODES } = require('../utils/constants');

const signUpUser = async (req, res, next) => {
    try {
        const { name, username, email, password, phone, dob, gender } = req.body;

        if (!name || !username || !email || !password) {
            throw new CustomError(STATUS_CODES.CONFLICT, "Enter required field!");
        }

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            throw new CustomError(STATUS_CODES.CONFLICT, "User already exists with the same username or email.");
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            name, username, email, password: hashedPassword, dob: dob ?? null, phone: phone ?? null, gender: gender ?? null,
        });

        if (!user) throw new CustomError(STATUS_CODES.INTERNAL_SERVER_ERROR, "Error while creating user!");

        sendActivationMail(user.name, user.email);

        const createdUser = await User.findById(user._id).select("-password -createdAt -updatedAt -__v");

        return res.status(STATUS_CODES.CREATED).json(new ApiResponse(STATUS_CODES.CREATED, createdUser, "User created successfully"));

    } catch (error) {
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        if (!username && !email) throw new CustomError(STATUS_CODES.BAD_REQUEST, "Enter required details.");
        if (!password) throw new CustomError(STATUS_CODES.BAD_REQUEST, "Password is required!");

        const user = await User.findOne({ $or: [{ username }, { email }] });

        if (!user) throw new CustomError(STATUS_CODES.NOT_FOUND, "User not found.");

        const passwordMatch = await comparePassword(password, user.password);

        if (!passwordMatch) throw new CustomError(STATUS_CODES.UNAUTHORIZED, "Invalid credentials.");

        const token = generateToken({ _id: user._id, secret: process.env.SECRET_KEY });

        user.isActive = true;
        await user.save({ validateBeforeSave: false });

        return res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, { name: user.name, email: user.email, token }, "Logged in successfully!"));

    } catch (error) {
        next(error);
    }
};

const getCurrentUser = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const loggedInUser = await User.findById(userId).select("name username");

        if (!loggedInUser) throw new CustomError(STATUS_CODES.NOT_FOUND, "No user found!");

        return res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, loggedInUser, "User details fetched successfully"));

    } catch (error) {
        next(error);
    }
};

const getProfile = async (req, res, next) => {
    try {

        return res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, { /* profile data */ }, "Profile fetched successfully"));

    } catch (error) {
        next(error);
    }
};

const signOutUser = async (req, res, next) => {
    try {
        return res.status(STATUS_CODES.NO_CONTENT).json(new ApiResponse(STATUS_CODES.NO_CONTENT, null, "User signed out successfully"));
    } catch (error) {
        next(error);
    }
};

const verifyEmail = async (req, res, next) => {
    let { email } = req.query;

    try {
        const user = await User.findOne({ email });

        if (!user) throw new CustomError(STATUS_CODES.FORBIDDEN, "Invalid link");

        if (user.isVerified) {
            throw new CustomError(STATUS_CODES.CONFLICT, "User already verified or invalid link!");
        }

        user.isVerified = true;
        await user.save({ validateBeforeSave: false });

        return res.status(STATUS_CODES.ACCEPTED).json(new ApiResponse(STATUS_CODES.ACCEPTED, null, "Your details are verified. You can now login with your credentials!"));

    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        return res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, null, "User details updated successfully"));

    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        return res.status(STATUS_CODES.NO_CONTENT).json(new ApiResponse(STATUS_CODES.NO_CONTENT, null, "User deleted successfully"));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    signUpUser,
    loginUser,
    getCurrentUser,
    getProfile,
    signOutUser,
    verifyEmail,
    updateUser,
    deleteUser,
};