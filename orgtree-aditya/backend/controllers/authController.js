const User = require("../models/User");
const jwt = require("jsonwebtoken");
const School = require("../models/School");

// Generate JWT Token
const generateToken = (id, role, schoolId) => {
  return jwt.sign({ id, role, schoolId }, process.env.JWT_SECRET, {
    expiresIn: "2m",
  });
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        message: "Account has been deactivated. Contact your administrator.",
      });
    }

    const school = await School.findOne({ schoolId: user.schoolId }).select(
      "name isFrozen freezeReason",
    );

    if (!school) {
      return res.status(404).json({ message: "School not found for this account" });
    }

    if (school.isFrozen) {
      return res.status(403).json({
        message:
          school.freezeReason ||
          `${school.name} is currently frozen and cannot access the platform.`,
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Return user data with token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      title: user.title,
      department: user.department,
      profilePhoto: user.profilePhoto,
      schoolId: user.schoolId,
      isDeputyAdmin: user.isDeputyAdmin,
      token: generateToken(user._id, user.role, user.schoolId),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { loginUser, getMe };
