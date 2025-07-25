const express = require("express");
const protect = require("../middlewares/authMiddleware");
const allowRoles = require("../middlewares/roleMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const {
  getUsers,
  deleteUser,
  getProfile,
  followUser,
  unFollowUser,
  updateUser,
} = require("../controllers/userController");
const { updateUserValidators } = require("../validators/updateUserValidators");
const Router = express.Router();

Router.get("/admin/allUsers/", protect, allowRoles("admin"), getUsers);
Router.delete("/:id", protect, allowRoles("admin"), deleteUser);
Router.get("/:id", getProfile);
Router.post("/:id/follow", protect, followUser);
Router.post("/:id/unFollow", protect, unFollowUser);
Router.put(
  "/:id",
  protect,
  upload.single("profileImage"),
  updateUserValidators,
  updateUser
);
module.exports = Router;
