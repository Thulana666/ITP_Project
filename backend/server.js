// backend/server.js
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/db");

// Import all routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const serviceProviderRoutes = require("./routes/serviceProviderRoutes");
const adminRoutes = require('./routes/adminRoutes');
const reviewRoutes = require("./routes/ReviewRoutes");
const packageRoutes = require('./routes/packageRoutes');
const serviceRoutes = require('./routes/serviceRouter');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Debugging: Check if MONGO_URI is loaded
console.log("Loaded MONGO_URI:", process.env.MONGO_URI);

// Check if MONGO_URI is set in the environment
if (!process.env.MONGO_URI) {
    console.error("Error: MONGO_URI is undefined. Check your .env file!");
    process.exit(1); // Stop the server if MONGO_URI is missing
}

// Connect to the database using the centralized connection function
connectDB();

// Routes
app.get("/", (req, res) => {
    res.send("The server is working!");
});

// Use all routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/service-provider", serviceProviderRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/reviews", reviewRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/services', serviceRoutes);

// Print registered routes in development
if (process.env.NODE_ENV !== 'production') {
    console.log("\nRegistered Routes:");
    app._router.stack.forEach((middleware) => {
        if (middleware.route) {
            console.log(`${Object.keys(middleware.route.methods).join(", ").toUpperCase()} ${middleware.route.path}`);
        } else if (middleware.name === 'router') {
            middleware.handle.stack.forEach((route) => {
                if (route.route) {
                    console.log(`${Object.keys(route.route.methods).join(", ").toUpperCase()} ${route.route.path}`);
                }
            });
        }
    });
    console.log("\n");
}

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

// Server Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Handle unhandled promise rejections to prevent crashes
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err.message);
    // Don't exit in production
    if (process.env.NODE_ENV !== 'production') {
        process.exit(1);
    }
});