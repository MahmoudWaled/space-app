const express = require("express");
const authController = require("../controllers/authController");
const upload = require("../middlewares/uploadMiddleware");
const { registerValidation } = require("../validators/authValidators");
const rateLimit = require("express-rate-limit");
const Router = express.Router();
const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5,
  message: "Too many login attempts, please try again later.",
});
Router.post(
  "/register",
  upload.single("profileImage"),
  registerValidation,
  authController.register
);
Router.post("/login", authLimiter, authController.login);
Router.post("/forgot-password", authController.forgotPassword);
Router.post("/reset-password/:token", authController.resetPassword);
module.exports = Router;
