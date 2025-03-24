// server.js
require("dotenv").config(); // Load environment variables first
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// Import all routes
const authRoutes = require("./routes/authRoutes");
const serviceProviderRoutes = require("./routes/serviceProviderRoutes");
const adminRoutes = require('./routes/adminRoutes');
const reviewRoutes = require("./routes/ReviewRoutes");
const packageRoutes = require('./routes/packageRoutes');
const paymentRoutes = require("./Routes/PaymentRoutes");

// Connect to MongoDB with improved error handling
connectDB().then(() => {
  console.log("MongoDB connected successfully");
}).catch(err => {
  console.error("MongoDB connection error:", err);
  process.exit(1); // Exit process if database connection fails
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.get("/", (req, res) => {
    res.send("The server is working!");
});

// Use all routes
app.use("/api/auth", authRoutes);
app.use("/api/service-provider", serviceProviderRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/reviews", reviewRoutes);
app.use('/api/packages', packageRoutes);
app.use("/api/payments", paymentRoutes);

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