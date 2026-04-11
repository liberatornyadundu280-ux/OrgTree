const express = require("express");
const router = express.Router();
const {
  getCampusMap,
  getBuildingById,
  upsertCampusMap,
} = require("../controllers/mapController");
const { protect, authorise } = require("../middleware/authMiddleware");

router.get("/", protect, getCampusMap);
router.get("/building/:buildingId", protect, getBuildingById);
router.put("/", protect, authorise("admin", "superadmin"), upsertCampusMap);

module.exports = router;
