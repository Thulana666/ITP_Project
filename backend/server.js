require("dotenv").config(); // Load environment variables first

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const paymentRoutes = require("./Routes/PaymentRoutes");

connectDB(); // Connect to MongoDB

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/payments", paymentRoutes);

// Global error handler
app.use((err, req, res, next) => {
    console.error("Error:", err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));