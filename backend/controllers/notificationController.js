const Notification = require('../models/Notification');

// Get notifications for a user
exports.getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            recipient: req.user.id,
            recipientType: req.user.role
        })
        .sort({ createdAt: -1 })
        .limit(50);  // Limit to last 50 notifications

        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notifications: " + error.message });
    }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        // Verify the notification belongs to the user
        if (notification.recipient.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        notification.isRead = true;
        await notification.save();

        res.json({ message: "Notification marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Error updating notification: " + error.message });
    }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user.id, isRead: false },
            { isRead: true }
        );

        res.json({ message: "All notifications marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Error updating notifications: " + error.message });
    }
};

// Create notification (internal use)
exports.createNotification = async (data) => {
    try {
        const notification = new Notification(data);
        await notification.save();
        return notification;
    } catch (error) {
        console.error("Error creating notification:", error);
        throw error;
    }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        if (notification.recipient.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await notification.deleteOne();
        res.json({ message: "Notification deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting notification: " + error.message });
    }
};
