const mongoose = require("mongoose");
const User = require("../models/User");
const Notification = require("../models/Notification");

exports.getAllUsers = async () => {
  return await User.find()
    .populate("followers", "username")
    .populate("following", "username")
    .sort({ createdAt: -1 });
};

exports.getProfileById = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId))
    throw new Error("invalid user id");

  const user = await User.findById(userId)
    .select("-password")
    .populate("followers", "username")
    .populate("following", "username");

  if (!user) throw new Error("user not found");

  const userObj = user.toObject();
  userObj.followersCount = user.followers.length;
  userObj.followingCount = user.following.length;

  return userObj;
};

exports.deleteUserById = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId))
    throw new Error("invalid user id");

  const user = await User.findByIdAndDelete(userId);
  if (!user) throw new Error("user not found");

  return `user ${user.username} deleted successfully`;
};

exports.updateUser = async (userId, updates) => {
  if (!mongoose.Types.ObjectId.isValid(userId))
    throw new Error("invalid user id");
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true }
  ).select("-__v");

  return updatedUser;
};

exports.followUser = async (targetUserId, currentUserId) => {
  if (!mongoose.Types.ObjectId.isValid(targetUserId))
    throw new Error("invalid user id");

  if (targetUserId === currentUserId)
    throw new Error("Cannot follow yourself");

  const userToFollow = await User.findById(targetUserId);
  const currentUser = await User.findById(currentUserId);

  if (!userToFollow) throw new Error("user not found");

  if (userToFollow.followers.includes(currentUserId))
    throw new Error(`Already following this user: ${userToFollow.username}`);

  userToFollow.followers.push(currentUserId);
  currentUser.following.push(targetUserId);

  await userToFollow.save();
  await currentUser.save();

  await Notification.create({
    recipient: userToFollow._id,
    sender: currentUser._id,
    type: "follow",
  });

  return `Followed user: ${userToFollow.username}`;
};

exports.unFollowUser = async (targetUserId, currentUserId) => {
  if (!mongoose.Types.ObjectId.isValid(targetUserId))
    throw new Error("invalid user id");

  if (targetUserId === currentUserId)
    throw new Error("Cannot unFollow yourself");

  const userToUnFollow = await User.findById(targetUserId);
  const currentUser = await User.findById(currentUserId);

  if (!userToUnFollow) throw new Error("user not found");

  if (!userToUnFollow.followers.includes(currentUserId))
    throw new Error(`you are not following this user: ${userToUnFollow.username}`);

  userToUnFollow.followers = userToUnFollow.followers.filter(
    (id) => id.toString() !== currentUserId
  );

  currentUser.following = currentUser.following.filter(
    (id) => id.toString() !== targetUserId
  );

  await userToUnFollow.save();
  await currentUser.save();

  return `unFollowed user: ${userToUnFollow.username}`;
};
