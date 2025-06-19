const User = require("../models/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");

exports.registerUser = async (data, file) => {
  const { username, email, password } = data;

  const existingUsername = await User.findOne({ username });
  if (existingUsername) throw new Error("Username or email already exists");

  const existingEmail = await User.findOne({ email });
  if (existingEmail) throw new Error("email is already used!");

  const hashedPassword = await bcrypt.hash(password, 10);
  const profileImage = file ? file.path : undefined;

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    profileImage,
  });

  return {
    user: {
      id: user._id,
      username: user.username,
      role: user.role,
      profileImage: user.profileImage,
    },
    token: generateToken(user),
  };
};

exports.loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  const isMatch = user && (await bcrypt.compare(password, user.password));

  if (!isMatch) throw new Error("invalid email or password.");

  return {
    user: { id: user._id, username: user.username, role: user.role },
    token: generateToken(user),
  };
};

exports.forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User with this email not found");

  const token = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
  await sendEmail(
    user.email,
    "Reset your password",
    `<p>Click <a href="${resetUrl}">here</a> to reset your password</p>`
  );
};

exports.resetPassword = async (token, newPassword) => {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) throw new Error("Invalid or expired token");

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
};
