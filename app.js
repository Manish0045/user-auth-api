// Import necessary modules
const express = require("express");
const cors = require('cors');
const helmet = require('helmet');

// Initialize the Express application
const app = express();

// Middleware to parse JSON and URL-encoded data with size limits
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

// Middleware to enhance security
app.use(helmet());

// Middleware to enable CORS with dynamic origin
app.use(cors({ origin: process.env.CORS_ORIGIN ?? "*" }));

// Route handling for user-related API endpoints
app.use('/api', require('./routes/user.routes'));

// Global error handling middleware
app.use((err, req, res, next) => {
    // Set the status code and message from the error object or use defaults
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error!";

    // Log the error for debugging purposes
    console.error(`[Error] ${statusCode} - ${message}`);

    // Send the error response
    return res.status(statusCode).json({
        status: "Error",
        statusCode: statusCode,
        message: message
    });
});

// Export the app module
module.exports = app;
