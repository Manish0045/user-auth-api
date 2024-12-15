const express = require("express");
const cors = require('cors');
const helmet = require('helmet');


const app = express();


app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN ?? "*" }));


app.use('/api', require('./routes/user.routes'));


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error!";

    return res.status(statusCode).json({
        status: "Error",
        statusCode: statusCode,
        message: message
    });
});

module.exports = app;
