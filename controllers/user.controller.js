const { CustomError } = require('../middlewares/errorHandler');
const { User } = require('../models/user.model');
const { ApiResponse } = require('../middlewares/apiResponse');
const { sendActivationMail } = require('../utils/mailServices');
const { hashPassword, comparePassword, generateToken } = require('../utils/constants');

const signUpUser = async (req, res) => {
    try {
        const { name, username, email, password, phone, dob, gender } = req.body;

        if (!name || !username || !email || !password) {
            throw new CustomError(409, "Enter required field!");
        }

        const existingUser = await User.find({ $or: [{ username }, { email }] });

        if (existingUser.length) throw new CustomError(409, "User already exist with same username or email....try something else!");

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            name: name,
            username: username,
            email,
            password: hashedPassword,
            dob: dob ?? null,
            phone: phone ?? null,
            gender: gender ?? null
        });

        if (!user) throw new CustomError(500, "Error while creating user!");

        sendActivationMail(user.name, user.email);

        const createdUser = await User.findById({ _id: user._id }).select("-password -createdAt -updatedAt -__v");

        return res.status(200).json(new ApiResponse(200, createdUser, "User created successfully"));

    } catch (error) {
        console.error(error);
        return res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
    }
}

const loginUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if (!username && !email) throw new CustomError(404, "Enter required Details");

        if (!password) throw new CustomError(404, "Password is required!");

        const user = await User.findOne({ $or: [{ username }, { email }] });

        const passwordMatch = await comparePassword(password, user.password);

        if (!passwordMatch) throw new CustomError(404, "Invalid Credentials");

        const token = generateToken({ _id: user._id, secret: process.env.SECRET_KEY });

        user.isActive = true;
        await user.save({ validateBeforeSave: false });

        return res.status(200).json(new ApiResponse(200, { name: user.name, email: user.email, token }, "Logged In SuccessFully!"));

    } catch (error) {
        console.error(error);
        return res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
    }
}

const getCurrentUser = async (req, res) => {
    try {

    } catch (error) {
        console.error(error);
        return res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
    }
}

const getProfile = async (req, res) => {
    try {

    } catch (error) {
        console.error(error);
        return res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
    }

}

const signOutUser = async (req, res) => {
    try {

    } catch (error) {
        console.error(error);
        return res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
    }

}

const verifyEmail = async (req, res) => {
    let { email } = req.query;
    try {
        const user = await User.findOne({ email });

        if (!user) throw new CustomError(403, "Invalid link");

        if (user.isVerified) {
            throw new CustomError(409, "Already Verfied....or Invalid link!");
        }

        user.isVerified = true;
        await user.save({ validateBeforeSave: false });

        return res.status(203).json(new ApiResponse(203, "Your details are vaerified....You can now login with your credentials!"));
    } catch (error) {
        console.error(error);
        return res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
    }
}

const updateUser = async (req, res) => {
    try {

    } catch (error) {
        console.error(error);
        return res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
    }
}

const deleteUser = async (req, res) => {
    try {

    } catch (error) {
        console.error(error);
        return res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
    }
}

module.exports = {
    signUpUser,
    loginUser,
    getCurrentUser,
    getProfile,
    signOutUser,
    verifyEmail,
    updateUser,
    deleteUser
}