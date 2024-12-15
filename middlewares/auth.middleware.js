const jwt = require('jsonwebtoken');
const { CustomError } = require('./errorHandler');
const { User } = require('../models/user.model');

const verifyJWT = async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new CustomError(401, "Unauthorized request");
        }

        const decodedData = await jwt.verify(token, process.env.SECRET_KEY);

        const user = await User.findById(decodedData?._id).select("-password");

        if (!user) {
            throw new CustomError(404, "Invalid Access Token!");
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error verifying user", error.message);

        if (error.name === "TokenExpiredError") {
            return next(new CustomError(401, "Token has expired"));
        } else if (error.name === "JsonWebTokenError") {
            return next(new CustomError(400, "Invalid token"));
        }

        next(error);
    }
};

module.exports = { verifyJWT };
