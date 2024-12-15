const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { CustomError } = require('../middlewares/errorHandler');

const DB_NAME = "user-auth";

const STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
    ACCEPTED: 202,
};


const generateToken = ({ _id, secret }) => {
    if (!secret) throw new CustomError(404, "Secret key missing");
    return jwt.sign({ _id }, secret);
}

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);

}

const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
}



module.exports = {
    DB_NAME,
    STATUS_CODES,
    generateToken,
    hashPassword,
    comparePassword
};