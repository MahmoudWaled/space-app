const notificationService = require("../services/notificationService");

const getMyNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getNotificationsByUser(req.user.id);
    res.json(notifications);
  } catch (error) {
    console.log({ message: error.message });
    res.status(500).json({ message: "server error." });
  }
};

const markAsRead = async (req, res) => {
  try {
    const message = await notificationService.markNotificationAsRead(
      req.params.id,
      req.user.id
    );
    res.json({ message });
  } catch (error) {
    console.log({ message: error.message });
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getMyNotifications,
  markAsRead,
};
