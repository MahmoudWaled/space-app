const User = require("../models/User");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

const register = async (req, res) => {
  try {
    if (req.fileValidationError) {
      return res.status(400).json({ error: req.fileValidationError });
    }
    const existUser = await User.findOne({ email: req.body.email });
    if (existUser)
      return res.status(400).json({ message: "email is already used!" });
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const profileImage = req.file ? req.file.path : undefined;
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

module.exports = { register, login };
