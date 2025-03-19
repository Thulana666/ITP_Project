require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');



const app = express();

// Middleware

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})


//mongodb+srv://serviceProvider:26X3W1NGEvE6RbgW@cluster1.w9s7l.mongodb.net/",
.then(() => {
    console.log('MongoDB Connected');
})
.catch(err => {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1); // Exit if MongoDB connection fails
});

// Import Routes
const packageRoutes = require('./routes/packageRoutes');

// Use Routes
app.use('/api/packages', packageRoutes);

//Test routes
app.get('/',(req, res) => {
    res.send("The server is working!");
});

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


// Start Server with error handling
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections to prevent crashes
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err.message);
    process.exit(1);
});
