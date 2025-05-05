const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); // Add this line
const fs = require('fs');
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const serviceProviderRoutes = require("./routes/serviceProviderRoutes");
const adminRoutes = require('./routes/adminRoutes'); 
const customerRoutes = require("./routes/customerRoutes"); // Import customer
const bookingRoutes = require("./routes/bookingRoutes"); 
const reviewRoutes = require("./routes/ReviewRoutes");
const packageRoutes = require('./routes/packageRoutes');
const serviceRoutes = require('./routes/serviceRouter');
const paymentRoutes = require("./routes/PaymentRoutes");
const notificationRoutes = require('./routes/notificationRoutes');

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configure static file serving - Add this before your routes
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(path.join(__dirname, 'public'))) {
    fs.mkdirSync(path.join(__dirname, 'public'));
}
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

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
//app.use('/api/service-provider', require('./routes/serviceProviderRoutes'));
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/services', serviceRoutes);
app.use("/api/payments", paymentRoutes);
app.use('/api/notifications', notificationRoutes);
// API health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});
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
// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});
// Global error handler with improved functionality from both branches
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  
  // Handle multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ 
      message: "File is too large. Maximum size is 5MB."
    });
  }
  
  res.status(500).json({ 
    message: err.message || "Something went wrong!",
    error: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
});
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