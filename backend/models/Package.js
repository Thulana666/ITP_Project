// backend/models/Package.js
const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
    packageName: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String,
        required: true
    },
    price: { 
        type: Number, 
        required: true 
    },
    discount: { 
        type: Number, 
        default: 0 
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Package', PackageSchema);