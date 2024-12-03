const app = require('./app');
const { connectDB } = require("./db/dbConnection");

const startServer = () => {
    const PORT = process.env.PORT ?? 8000;
    try {
        app.listen(PORT, () => {
            console.log("Server started! PORT:", PORT);
        });
    } catch (error) {
        console.log("Error starting the server", error.message);
        process.exit(1);
    }
};

connectDB()
    .then(() => startServer())
    .catch((err) => {
        console.log("Something Went wrong while connecting to DATABASE", err.message);
    });