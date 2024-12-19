const jwt = require('jsonwebtoken');
const { CustomError } = require('./errorHandler');
const { User } = require('../models/user.model');
const { STATUS_CODES } = require('../utils/constants');

const verifyJWT = async (req, _, next) => {
    // const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    const token = req.header("Authorization").split(" ")[1];

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
        }

        next(error);
    }
};

module.exports = { verifyJWT };
