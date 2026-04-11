const express = require("express");
const router = express.Router();
const {
  getMyAchievements,
  getAchievementsByUser,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} = require("../controllers/achievementController");
const { protect } = require("../middleware/authMiddleware");

router.get("/me", protect, getMyAchievements);
router.post("/", protect, createAchievement);
router.get("/:userId", protect, getAchievementsByUser);
router.put("/:id", protect, updateAchievement);
router.delete("/:id", protect, deleteAchievement);

module.exports = router;
