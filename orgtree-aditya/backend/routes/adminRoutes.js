const express = require("express");
const router = express.Router();
const {
  getAdminMessages,
  createAdminMessage,
  resolveAdminMessage,
  getAuditLog,
  getMessageQueue,
  assignDeputyAdmin,
} = require("../controllers/adminController");
const { protect, authorise } = require("../middleware/authMiddleware");

router.get("/messages", protect, authorise("admin", "superadmin"), getAdminMessages);
router.post("/messages", protect, createAdminMessage);
router.put(
  "/messages/:id/resolve",
  protect,
  authorise("admin", "superadmin"),
  resolveAdminMessage,
);
router.get("/audit", protect, authorise("admin", "superadmin"), getAuditLog);
router.post("/deputy", protect, authorise("admin", "superadmin"), assignDeputyAdmin);
router.get(
  "/message-queue",
  protect,
  authorise("admin", "superadmin"),
  getMessageQueue,
);

module.exports = router;
