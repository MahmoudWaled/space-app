const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role ,username:user.username , name:user.name},
    process.env.JWT_SECRET,
    {expiresIn: "7d"});
};

module.exports = generateToken;
