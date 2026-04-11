const express = require("express");
const router = express.Router();
const { loginUser, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.post("/login", loginUser);

// Protected routes
router.get("/me", protect, getMe);

module.exports = router;
