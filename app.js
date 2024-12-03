const express = require("express");
const cors = require('cors');

const app = express();
app.use(express.json({ limit: '30kb' }));
app.use(express.urlencoded({ extended: true, limit: '30kb' }));

app.use(cors({ origin: process.env.CORS_ORIGIN ?? "*" }));

app.use('/api', require('./routes/user.routes'));

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong!";

    return res.status(statusCode).json({
        status: statusCode,
        message: message
    });
});

module.exports = app;
