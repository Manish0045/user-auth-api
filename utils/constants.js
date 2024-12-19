const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { CustomError } = require('../middlewares/errorHandler');

// Database name
const DB_NAME = process.env.DB_NAME || "user-auth";

// Status codes for API responses
const STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
};

// Function for generate access token
const generateToken = ({ _id, secret }) => {
    if (!secret) throw new CustomError(404, "Secret key missing");
    return jwt.sign({ _id }, secret);
}

// Function for hash password  
const hashPassword = async (password) => await bcrypt.hash(password, 10);

// Function for compare password with hashed password
const comparePassword = async (password, hashedPassword) => await bcrypt.compare(password, hashedPassword);


module.exports = {
    DB_NAME,
    STATUS_CODES,
    generateToken,
    hashPassword,
    comparePassword
};