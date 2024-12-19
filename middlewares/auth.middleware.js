const jwt = require('jsonwebtoken');
const { CustomError } = require('./errorHandler');
const { User } = require('../models/user.model');
const { STATUS_CODES } = require('../utils/constants');

const verifyJWT = async (req, _, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return next(new CustomError(STATUS_CODES.BAD_REQUEST, "BAD_REQUEST : No token provided"));
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return next(new CustomError(STATUS_CODES.BAD_REQUEST, "BAD_REQUEST : No token provided"));
    }

    try {
        const decodedData = await jwt.verify(token, process.env.SECRET_KEY);

        const user = await User.findById(decodedData?._id).select("_id username email");

        if (!user) {
            throw new CustomError(STATUS_CODES.UNAUTHORIZED, "Unauthorized : Invalid Access Token!");
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error verifying user", error.message);

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