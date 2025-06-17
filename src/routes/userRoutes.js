const express = require("express");
const protect = require("../middlewares/authMiddleware");
const allowRoles = require("../middlewares/roleMiddleware");
const {
  getUsers,
  deleteUser,
  getProfile,
  followUser,
  unFollowUser,
} = require("../controllers/userController");
const Router = express.Router();

Router.get("/admin/allUsers/", protect, allowRoles("admin"), getUsers);
Router.delete("/:id", protect, allowRoles("admin"), deleteUser);
Router.get("/:id", protect, getProfile);
Router.post("/:id/follow", protect, followUser);
Router.post("/:id/unFollow", protect, unFollowUser);

module.exports = Router;
