const { validationResult } = require("express-validator");
const userService = require("../services/userService");
const bcrypt = require("bcrypt");

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

const updateUser = async (req, res) => {
  try {
     if (req.fileValidationError) return res.status(400).json({ error: req.fileValidationError });
    
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array().map(e => e.msg) });
    const userId = req.params.id;
    const updates = req.body;
     if ("role" in updates) {
      delete updates.role;
    }

    if (req.file) {
      updates.profileImage = `${req.file.filename}`;
    }

     if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }
    const updatedUser = await userService.updateUser(userId, updates);

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Server error" });
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
  updateUser
};
