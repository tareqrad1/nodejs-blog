import Notification from "../models/notification.model.js";

export const getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ to: req.user._id });
        if (notifications.length === 0) {
            return res.status(404).json({ error: "No notifications found" });
        }
        res.status(200).json({ message: "Notifications fetched successfully", notifications });
    } catch (error) {
        console.log('err', error);
        
        res.status(500).json({ error: "Internal server error", error });
    }
}