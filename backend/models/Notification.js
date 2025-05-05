const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipientType: {
        type: String,
        enum: ['service_provider', 'customer', 'admin'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['booking', 'package', 'payment', 'system'],
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    relatedId: {
        type: mongoose.Schema.Types.ObjectId,
        // This could reference a booking, package, etc.
        refPath: 'relatedModel'
    },
    relatedModel: {
        type: String,
        enum: ['Booking', 'Package', 'Payment']
    }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
