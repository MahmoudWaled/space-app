const { default: mongoose } = require("mongoose");
const Notification = require("../models/Notification");

const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 })
      .populate("sender", "username")
      .populate("post", "content");
    res.json(notifications);
  } catch (error) {
    console.log({ message: error.message });
    res.status(500).json({ message: "server error." });
  }
};

const markAsRead = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: "invalid notification id" });
    const notification = await Notification.findById(req.params.id);
    if (!notification || notification.recipient.toString() !== req.user.id)
      return res.status(403).json({ message: "not allowed action." });
    notification.read = true;
    await notification.save();
    res.json({ message: "notification marked as read" });
  } catch (error) {
    console.log({ message: error.message });
    res.status(500).json({ message: "server error." });
  }
};

module.exports = { getMyNotifications , markAsRead};
