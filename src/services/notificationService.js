const mongoose = require("mongoose");
const Notification = require("../models/Notification");

exports.getNotificationsByUser = async (userId) => {
  return await Notification.find({ recipient: userId })
    .sort({ createdAt: -1 })
    .populate("sender", "username")
    .populate("post", "content");
};

exports.markNotificationAsRead = async (notificationId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(notificationId)) {
    throw new Error("invalid notification id");
  }

  const notification = await Notification.findById(notificationId);

  if (!notification || notification.recipient.toString() !== userId) {
    throw new Error("not allowed action.");
  }

  notification.read = true;
  await notification.save();

  return "notification marked as read";
};
