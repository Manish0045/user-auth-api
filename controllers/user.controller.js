const { CustomError } = require('../middlewares/errorHandler');
const { User } = require('../models/user.model');
const { ApiResponse } = require('../middlewares/apiResponse');
const { sendActivationMail } = require('../utils/mailServices');
const { hashPassword, comparePassword, generateToken, STATUS_CODES } = require('../utils/constants');

const signUpUser = async (req, res, next) => {
    const { username, email, password, userRole } = req.body;

    try {
        // Validate input
        if (!username || !email || !password) {
            throw new CustomError(STATUS_CODES.BAD_REQUEST, "Username, email, and password are required fields.");
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            throw new CustomError(STATUS_CODES.CONFLICT, "A user with this username or email already exists.");
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create new user
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            userRole: userRole || 'user',
        });

        if (!user) {
            throw new CustomError(STATUS_CODES.INTERNAL_SERVER_ERROR, "An error occurred while creating the user.");
        }

        // Send activation email
        sendActivationMail(user.username, user.email);

        // Return created user
        const createdUser = await User.findById(user._id).select("name username email");
        return res.status(STATUS_CODES.CREATED).json(new ApiResponse(STATUS_CODES.CREATED, createdUser, "Account successfully created. Please check your email for activation."));

    } catch (error) {
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        // Validate input
        if (!username && !email) throw new CustomError(STATUS_CODES.BAD_REQUEST, "Please provide either a username or email.");
        if (!password) throw new CustomError(STATUS_CODES.BAD_REQUEST, "Password is required.");

        // Find user by username or email
        const user = await User.findOne({ $or: [{ username }, { email }] });
        if (!user) throw new CustomError(STATUS_CODES.NOT_FOUND, "User not found.");

        // Check password match
        const passwordMatch = await comparePassword(password, user.password);
        if (!passwordMatch) throw new CustomError(STATUS_CODES.UNAUTHORIZED, "Incorrect password.");

        // Check if user is verified
        if (!user.isVerified) {
            throw new CustomError(STATUS_CODES.UNAUTHORIZED, "Your email is not verified. Please verify it first.");
        }

        // Generate JWT token
        const token = generateToken({ _id: user._id, secret: process.env.SECRET_KEY });

        // Mark user as active
        user.isActive = true;
        await user.save({ validateBeforeSave: false });

        return res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, { name: user.name, email: user.email, token }, "Login successful."));

    } catch (error) {
        next(error);
    }
};

const getCurrentUser = async (req, res, next) => {
    try {
        const userId = req.user._id;

        if (!userId) throw new CustomError(STATUS_CODES.BAD_REQUEST, "Invalid user ID.");

        // Find logged-in user details
        const loggedInUser = await User.findById(userId).select("name username email");
        if (!loggedInUser) throw new CustomError(STATUS_CODES.NOT_FOUND, "User not found.");

        return res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, loggedInUser, "User details retrieved successfully."));

    } catch (error) {
        next(error);
    }
};

const getProfile = async (req, res, next) => {
    try {
        const userId = req.body.userId || req.user._id;

        if (!userId) throw new CustomError(STATUS_CODES.BAD_REQUEST, "User ID is required.");

        // Find user profile, excluding sensitive fields
        const profile = await User.findById(userId).select("-password -createdAt -updatedAt -__v");
        if (!profile) throw new CustomError(STATUS_CODES.NOT_FOUND, "Profile not found.");

        return res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, { user: profile }, "Profile retrieved successfully."));

    } catch (error) {
        next(error);
    }
};

const signOutUser = async (req, res, next) => {
    try {
        const userId = req.user._id;

        // Mark user as inactive
        const user = await User.findById(userId);
        user.isActive = false;
        await user.save({ validateBeforeSave: false });

        return res.status(STATUS_CODES.NO_CONTENT).json(new ApiResponse(STATUS_CODES.NO_CONTENT, null, "User successfully signed out."));

    } catch (error) {
        next(error);
    }
};

const verifyEmail = async (req, res, next) => {
    const { email } = req.query;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) throw new CustomError(STATUS_CODES.FORBIDDEN, "Invalid verification link.");

        // If user is already verified
        if (user.isVerified) {
            throw new CustomError(STATUS_CODES.CONFLICT, "User is already verified.");
        }

        // Verify user
        user.isVerified = true;
        await user.save({ validateBeforeSave: false });

        return res.status(STATUS_CODES.ACCEPTED).json(new ApiResponse(STATUS_CODES.ACCEPTED, null, "Your email has been successfully verified. You can now log in."));

    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    const { userId, username, email } = req.body;

    try {
        // Validate required fields
        if (!userId || !username || !email) {
            throw new CustomError(STATUS_CODES.BAD_REQUEST, "User ID, username, and email are required.");
        }

        // Update user details
        const updatedUser = await User.findByIdAndUpdate(userId, { username, email }, { new: true });
        if (!updatedUser) throw new CustomError(STATUS_CODES.NOT_FOUND, "User not found.");

        return res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, updatedUser, "User details updated successfully."));

    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    const { userId } = req.body;

    try {
        // Delete user by ID
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) throw new CustomError(STATUS_CODES.NOT_FOUND, "User not found.");

        return res.status(STATUS_CODES.NO_CONTENT).json(new ApiResponse(STATUS_CODES.NO_CONTENT, null, "User deleted successfully."));

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
