const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { CustomError } = require('../middlewares/errorHandler');

const DB_NAME = "user-auth";

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
    generateToken,
    hashPassword,
    comparePassword
};