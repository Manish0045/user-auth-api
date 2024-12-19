const jwt = require('jsonwebtoken');
const { CustomError } = require('./errorHandler');
const { User } = require('../models/user.model');
const { STATUS_CODES } = require('../utils/constants');

// A middleware to verify the JWT token sent in the Authorization header of the request and attach the user object to the request object
const verifyJWT = async (req, _, next) => {
    // Get the token from the Authorization header
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return next(new CustomError(STATUS_CODES.BAD_REQUEST, "BAD_REQUEST : No token provided"));
    }

    // Extract the token from the header
    const token = authHeader.split(" ")[1];
    if (!token) {
        return next(new CustomError(STATUS_CODES.BAD_REQUEST, "BAD_REQUEST : No token provided"));
    }

    try {
        // Verify the token
        const decodedData = await jwt.verify(token, process.env.SECRET_KEY);

        // Find the user by the decoded data
        const user = await User.findById(decodedData?._id).select("_id username email");

        if (!user) {
            throw new CustomError(STATUS_CODES.UNAUTHORIZED, "Unauthorized : Invalid Access Token!");
        }

        // Attach the user object to the request object
        req.user = user;
        next();
    } catch (error) {
        // Log the error for debugging purposes
        console.log("Error verifying user", error.message);

        // Handle different types of errors
        if (error.name === "TokenExpiredError") {
            return next(new CustomError(STATUS_CODES.UNAUTHORIZED, "Unauthorized : Token has expired"));
        } else if (error.name === "JsonWebTokenError") {
            return next(new CustomError(STATUS_CODES.BAD_REQUEST, "BAD_REQUEST : Invalid token"));
        } else {
            return next(new CustomError(STATUS_CODES.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR : An error occurred"));
        }
    }
};

module.exports = verifyJWT;