const mongoose = require('mongoose');
const { DATABASE } = require("../utils/constants");

const connectDB = async () => {
    const MONGO_URL = process.env.MONGO_URI + DATABASE;
    try {
        const connectionInstance = await mongoose.connect(MONGO_URL);
        console.log("Database Connected!");
        console.log("DATABASE:", connectionInstance.connection.name, " HOST:", connectionInstance.connection.host);
    } catch (error) {
        console.log("Error connecting to DATABASE", error.message);
        process.exit(1);
    }
}

module.exports = { connectDB };