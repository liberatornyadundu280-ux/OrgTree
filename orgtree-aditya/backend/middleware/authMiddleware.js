const jwt = require("jsonwebtoken");
const User = require("../models/User");
const School = require("../models/School");

// Protect routes - verify token
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "Not authorised. User not found." });
      }

      const school = await School.findOne({ schoolId: req.user.schoolId }).select(
        "name isFrozen freezeReason",
      );

      if (!school) {
        return res.status(404).json({ message: "School not found for this account." });
      }

      if (school.isFrozen) {
        return res.status(403).json({
          message:
            school.freezeReason ||
            `${school.name} is currently frozen and cannot access the platform.`,
        });
      }

      req.school = school;

      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorised. Token failed." });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorised. No token." });
  }
};

// Role based access
const authorise = (...roles) => {
  return (req, res, next) => {
    const hasRole = roles.includes(req.user.role);
    const hasDeputyAdminAccess = roles.includes("admin") && req.user.isDeputyAdmin;

    if (!hasRole && !hasDeputyAdminAccess) {
      return res.status(403).json({
        message: `Role '${req.user.role}' is not authorised to access this route`,
      });
    }
    next();
  };
};

module.exports = { protect, authorise };
