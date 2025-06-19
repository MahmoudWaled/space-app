const userService = require("../services/userService");

const getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "server error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await userService.getProfileById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const message = await userService.deleteUserById(req.params.id);
    res.json({ message });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const followUser = async (req, res) => {
  try {
    const message = await userService.followUser(req.params.id, req.user.id);
    res.json({ message });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const unFollowUser = async (req, res) => {
  try {
    const message = await userService.unFollowUser(req.params.id, req.user.id);
    res.json({ message });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getUsers,
  getProfile,
  deleteUser,
  followUser,
  unFollowUser,
};
