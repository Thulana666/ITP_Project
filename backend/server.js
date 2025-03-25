const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const serviceProviderRoutes = require("./routes/serviceProviderRoutes");
const adminRoutes = require('./routes/adminRoutes'); 
const customerRoutes = require("./routes/customerRoutes"); // Import customer
dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to the database
connectDB();

// Routes
app.get("/", (req, res) => {
    res.send("API is running...");
});
app.use("/api/auth", authRoutes);
app.use("/api/service-provider", serviceProviderRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/customer", customerRoutes); // Register routes
app.use('/api/service-provider', require('./routes/serviceProviderRoutes'));

// Server Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
