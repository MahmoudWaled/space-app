const User = require("../models/User");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const { validationResult } = require('express-validator');
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const register = async (req, res) => {
  try {
    if (req.fileValidationError) {
      return res.status(400).json({ error: req.fileValidationError });
    }
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map(error=> error.msg) });
  }
    const userWithUsername = await User.findOne({  username: req.body.username  });
    if (userWithUsername) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    const existUser = await User.findOne({ email: req.body.email });
    if (existUser)
      return res.status(400).json({ message: "email is already used!" });
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const profileImage = await req.file ? req.file.path : undefined;
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      profileImage: profileImage,
    });
    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        profileImage: profileImage,
      },
      token: generateToken(user),
    });
  } catch (error) {
    console.log({ message: error.message });
    res.status(500).json({ message: "server error." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "invalid email or password." });
    res.json({
      user: { id: user._id, username: user.username, role: user.role },
      token: generateToken(user),
    });
  } catch (error) {
    console.log({ message: error.message });
    res.status(500).json({ message: "server error." });
  }
};


const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: "User with this email not found" });

    const token = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: user.email,
      subject: "Reset your password",
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password</p>`,
    });

    res.json({ message: "Reset link sent to your email" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};


const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, 
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Password has been reset successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login ,forgotPassword,resetPassword };
