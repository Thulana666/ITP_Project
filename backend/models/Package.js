// backend/models/Package.js
const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
    serviceProvider: { 
        type: String, 
        required: true
    },
    packageName: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    description: { 
        type: String
    },
    discount: { 
        type: Number, 
        default: 0 
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        // Not required for backward compatibility with existing data
    }
}, { timestamps: true });

module.exports = mongoose.model('Package', PackageSchema);