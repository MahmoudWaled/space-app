const express = require("express");
const User = require("../models/User");
const { default: mongoose } = require("mongoose");
const Notification = require("../models/Notification");
const Router = express.Router();

const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate("followers", "username")
      .populate("following", "username")
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.log(error.message);
    res.status(500), json({ message: "server error" });
  }
};

const getProfile = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: "invalid user id" });
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("followers", "username")
      .populate("following", "username");
    if (!user) return res.status(404).json({ message: "user not found" });
    console.log(user)
    const userObject = user.toObject();
    userObject.followersCount = user.followers.length;
    userObject.followingCount = user.following.length;
    res.json(userObject);
  } catch (error) {
    console.log(error.message);
    res.status(500), json({ message: "server error" });
  }
};
const deleteUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: "invalid user id" });
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "user not found" });
    res.json({ message: `user ${user.username} deleted successfully` });
  } catch (error) {
    console.log({ errorMessage: error.message });
    res.status(500).json({ message: "server error" });
  }
};

const followUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: "invalid user id" });

    const targetUserId = req.params.id;
    const currentUserId = req.user.id;
    if (targetUserId === currentUserId)
      return res.status(400).json({ message: "Cannot follow yourself" });

    const userToFollow = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);
    if (!userToFollow)
      return res.status(404).json({ message: "user not found" });
    if (userToFollow.followers.includes(currentUserId))
      return res.status(400).json({
        message: `Already following this user: ${userToFollow.username}`,
      });

    userToFollow.followers.push(currentUserId);
    currentUser.following.push(targetUserId);
    await userToFollow.save();
    await currentUser.save();
    await Notification.create({
      recipient: userToFollow._id,
      sender: currentUser._id,
      type: "follow",
    });

    res.json({ message: `Followed user: ${userToFollow.username}` });
  } catch (error) {
    console.log({ errorMessage: error.message });
    res.status(500).json({ message: "server error" });
  }
};

const unFollowUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: "invalid user id" });
    const targetUserId = req.params.id;
    const currentUserId = req.user.id;
    if (targetUserId === currentUserId)
      return res.status(400).json({ message: "Cannot unFollow yourself" });
    const userToUnFollow = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);
    if (!userToUnFollow)
      return res.status(404).json({ message: "user not found" });
    if (!userToUnFollow.followers.includes(currentUserId))
      return res.status(400).json({
        message: `you are not following this user:${userToUnFollow.username}`,
      });
    userToUnFollow.followers = userToUnFollow.followers.filter(
      (id) => id.toString() !== currentUserId
    );
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== targetUserId
    );
    await userToUnFollow.save();
    await currentUser.save();
    res.json({ message: `unFollowed user: ${userToUnFollow.username}` });
  } catch (error) {
    console.log({ errorMessage: error.message });
    res.status(500).json({ message: "server error" });
  }
};

module.exports = { getUsers, deleteUser, getProfile, followUser, unFollowUser };
