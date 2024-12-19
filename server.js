// Import the application and database connection module
const app = require('./app');
const { connectDB } = require("./db/dbConnection");

// Function to start the server
const startServer = () => {
    const PORT = process.env.PORT || 8000;
    try {
        // Start listening on the specified port
        app.listen(PORT, () => {
            console.log("Server started! PORT:", PORT);
        });
    } catch (error) {
        // Log the error and exit the process with failure code
        console.error("Error starting the server", error.message);
        process.exit(1);
    }
};

// Connect to the database
connectDB()
    .then(() => {
        // If connection is successful, start the server
        startServer();
    })
    .catch((err) => {
        // Log the error and exit the process with failure code
        console.error("Database connection failed", err.message);
        process.exit(1);
    });