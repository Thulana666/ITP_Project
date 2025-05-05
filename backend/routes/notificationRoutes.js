const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const notificationController = require('../controllers/notificationController');
const Notification = require('../models/Notification');

// Get user's notifications
router.get('/', verifyToken, notificationController.getUserNotifications);

// Mark notification as read
router.put('/:id/read', verifyToken, notificationController.markAsRead);

// Mark all notifications as read
router.put('/read-all', verifyToken, notificationController.markAllAsRead);

// Delete notification
router.delete('/:id', verifyToken, notificationController.deleteNotification);

// Create notification
router.post('/', verifyToken, async (req, res) => {
    try {
        const { recipient, recipientType, title, message, type, relatedId, relatedModel } = req.body;
        
        const notification = new Notification({
            recipient,
            recipientType,
            title,
            message,
            type,
            relatedId,
            relatedModel,
            isRead: false
        });

        await notification.save();
        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ message: "Error creating notification: " + error.message });
    }
});

module.exports = router;
