const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: "Access forbidden" });
    }
    next();
  };
};

module.exports = allowRoles;


