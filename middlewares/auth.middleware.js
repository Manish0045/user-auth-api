const jwt = require('jsonwebtoken');
const { CustomError } = require('./errorHandler');
const { User } = require('../models/user.model');

const verifyJWT = async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authentication")?.replace("Bearer", "");

        if (!token) {
            throw new CustomError(401, "Unauthorized request");
        }

        const decodedData = await jwt.verify(token, process.env.SECRET_KEY);

        const user = await User.findById(decodedData._id).select("-password");

        if (!user) {
            throw new CustomError(404, "Invalid Access Token!");
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error verifying user", err.message);
        throw new CustomError(error.statusCode || 500, error.message);
    }
};

module.exports = { verifyJWT };