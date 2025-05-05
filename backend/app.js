const express = require('express');
const app = express();

// Add these lines after your other middleware configurations
app.use(express.static('public'));
app.use('/uploads', express.static('public/uploads'));

// ...existing code...