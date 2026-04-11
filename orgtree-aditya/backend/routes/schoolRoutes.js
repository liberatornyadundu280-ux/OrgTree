const express = require("express");
const router = express.Router();
const {
  listSchools,
  getCurrentSchool,
  getSchoolById,
  createSchool,
  updateSchool,
  freezeSchool,
  unfreezeSchool,
} = require("../controllers/schoolController");
const { protect, authorise } = require("../middleware/authMiddleware");

router.get("/", protect, authorise("superadmin"), listSchools);
router.post("/", protect, authorise("superadmin"), createSchool);
router.get("/current", protect, getCurrentSchool);
router.put("/:schoolId", protect, authorise("admin", "superadmin"), updateSchool);
router.put(
  "/:schoolId/freeze",
  protect,
  authorise("admin", "superadmin"),
  freezeSchool,
);
router.put(
  "/:schoolId/unfreeze",
  protect,
  authorise("admin", "superadmin"),
  unfreezeSchool,
);
router.get("/:schoolId", getSchoolById);

module.exports = router;
