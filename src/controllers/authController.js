const { validationResult } = require("express-validator");
const authService = require("../services/authService");

const register = async (req, res) => {
  try {
    if (req.fileValidationError) return res.status(400).json({ error: req.fileValidationError });

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array().map(e => e.msg) });

    const result = await authService.registerUser(req.body, req.file);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);
    res.json(result);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    await authService.forgotPassword(req.body.email);
    res.json({ message: "Reset link sent to your email" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    await authService.resetPassword(req.params.token, req.body.password);
    res.json({ message: "Password has been reset successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { register, login, forgotPassword, resetPassword };
