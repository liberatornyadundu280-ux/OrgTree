const express = require("express");
const router = express.Router();
const {
  getNotifications,
  createNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getNotificationAnalytics,
} = require("../controllers/notificationController");
const { protect, authorise } = require("../middleware/authMiddleware");

router.get("/", protect, getNotifications);
router.get(
  "/analytics",
  protect,
  authorise("admin", "superadmin"),
  getNotificationAnalytics,
);
router.post("/", protect, createNotification);
router.put("/read-all", protect, markAllNotificationsAsRead);
router.put("/:id/read", protect, markNotificationAsRead);
router.delete("/:id", protect, deleteNotification);

module.exports = router;
