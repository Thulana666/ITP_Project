require("dotenv").config(); // Load environment variables first
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const paymentRoutes = require("./Routes/PaymentRoutes");

// Connect to MongoDB
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
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/payments", paymentRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ 
    message: err.message || "Something went wrong!",
    error: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));