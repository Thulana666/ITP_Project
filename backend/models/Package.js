//Package.js
const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
    serviceProvider: { type: String, required: true },
    packageName: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String,},
    discount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Package', PackageSchema);
