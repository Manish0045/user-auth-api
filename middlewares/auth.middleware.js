const jwt = require('jsonwebtoken');
const { CustomError } = require('./errorHandler');

const verifyJWT = async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authentication")?.replace("Bearer", "");

    if (!token) {
        throw new CustomError(401, "Unauthorized request");
    }
};

