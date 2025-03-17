//pass = VcmE2MTj3ATDnapM

const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        console.log("MongoDB URI:", process.env.MONGO_URI); // Debugging Line

        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing from .env file");
        }

        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1); // Exit with failure
    }
};

// Handle unexpected MongoDB connection errors
mongoose.connection.on("error", (err) => {
    console.error("MongoDB Error:", err.message);
});

module.exports = connectDB;



