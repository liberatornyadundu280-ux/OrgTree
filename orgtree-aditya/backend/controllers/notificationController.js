const Notification = require("../models/Notification");
const NotificationAnalytics = require("../models/NotificationAnalytics");
const School = require("../models/School");
const User = require("../models/User");
const { logAudit } = require("../utils/auditLogger");
const {
  buildAudienceQuery,
  enqueueNotificationMessages,
} = require("../utils/notificationQueue");

const broadcasterRoles = ["teacher", "hod", "principal", "admin", "superadmin"];

const buildVisibilityQuery = (user) => ({
  schoolId: user.schoolId,
  expiresAt: { $gt: new Date() },
  $or: [
    {
      targetScope: "institution",
      targetRoles: { $size: 0 },
    },
    {
      targetScope: "role",
      targetRoles: user.role,
    },
    {
      targetScope: "department",
      targetDepartmentId: user.department,
    },
  ],
});

const getAudienceSize = async (notification) =>
  User.countDocuments(buildAudienceQuery(notification));

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find(buildVisibilityQuery(req.user))
      .sort({ createdAt: -1 })
      .populate("createdBy", "name role");

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const createNotification = async (req, res) => {
  try {
    if (!broadcasterRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Not authorised to create notifications" });
    }

    const {
      type,
      title,
      body,
      targetRoles,
      targetScope,
      targetDepartmentId,
      priority,
      expiresAt,
      channel,
      channels,
    } = req.body;
    const resolvedTargetRoles = targetRoles || [];
    const resolvedTargetScope =
      targetScope || (resolvedTargetRoles.length ? "role" : "institution");

    if (!title || !body) {
      return res.status(400).json({ message: "Title and body are required" });
    }

    if (req.user.role === "teacher" && resolvedTargetScope !== "department") {
      return res.status(403).json({
        message: "Teachers can only send department-scoped notifications",
      });
    }

    if (
      req.user.role === "teacher" &&
      targetDepartmentId &&
      targetDepartmentId !== req.user.department
    ) {
      return res.status(403).json({
        message: "Teachers can only notify their own department",
      });
    }

    let resolvedExpiry = expiresAt;

    if (!resolvedExpiry) {
      const school = await School.findOne({ schoolId: req.user.schoolId }).select(
        "defaultNotificationExpiry",
      );
      const days = school?.defaultNotificationExpiry || 7;
      resolvedExpiry = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    }

    if (new Date(resolvedExpiry) <= new Date()) {
      return res.status(400).json({ message: "Expiry date must be in the future" });
    }

    const notification = await Notification.create({
      schoolId: req.user.schoolId,
      createdBy: req.user._id,
      creatorRole: req.user.role,
      type,
      title,
      body,
      targetRoles: resolvedTargetRoles,
      targetScope: resolvedTargetScope,
      targetDepartmentId:
        resolvedTargetScope === "department"
          ? targetDepartmentId || req.user.department
          : "",
      priority,
      expiresAt: resolvedExpiry,
    });

    const audienceSize = await getAudienceSize(notification);
    const deliveryChannels = Array.isArray(channels)
      ? channels
      : channel
        ? [channel]
        : [];
    const queuedMessages = await enqueueNotificationMessages(
      notification,
      deliveryChannels,
    );

    await NotificationAnalytics.create({
      schoolId: notification.schoolId,
      notificationId: notification._id,
      type: notification.type,
      createdBy: notification.createdBy,
      audienceSize,
      readCount: 0,
      channel: deliveryChannels.length ? deliveryChannels.join(",") : "in-app",
      expiredAt: notification.expiresAt,
    });

    res.status(201).json({
      notification,
      queuedMessageCount: queuedMessages.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        ...buildVisibilityQuery(req.user),
      },
      {
        $addToSet: { isRead: req.user._id },
      },
      { new: true },
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    await NotificationAnalytics.findOneAndUpdate(
      {
        notificationId: notification._id,
        schoolId: req.user.schoolId,
      },
      {
        readCount: notification.isRead.length,
      },
    );

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const markAllNotificationsAsRead = async (req, res) => {
  try {
    const notifications = await Notification.find(buildVisibilityQuery(req.user)).select(
      "_id isRead",
    );

    const notificationIds = notifications.map((notification) => notification._id);

    await Notification.updateMany(
      { _id: { $in: notificationIds } },
      { $addToSet: { isRead: req.user._id } },
    );

    await Promise.all(
      notifications.map((notification) => {
        const alreadyRead = notification.isRead.some(
          (readerId) => readerId.toString() === req.user._id.toString(),
        );
        const readCount = alreadyRead
          ? notification.isRead.length
          : notification.isRead.length + 1;

        return NotificationAnalytics.findOneAndUpdate(
          { notificationId: notification._id, schoolId: req.user.schoolId },
          { readCount },
        );
      }),
    );

    res.json({
      message: "All visible notifications marked as read",
      count: notificationIds.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      schoolId: req.user.schoolId,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    const isCreator = notification.createdBy.toString() === req.user._id.toString();
    const isAdmin = ["admin", "superadmin"].includes(req.user.role);

    if (!isCreator && !isAdmin) {
      return res.status(403).json({
        message: "Only the creator or an admin can delete this notification",
      });
    }

    await notification.deleteOne();
    await logAudit(req, {
      action: "notificationDelete",
      targetId: notification._id,
      targetType: "notification",
      requestStatus: "approved",
      metadata: {
        title: notification.title,
        type: notification.type,
        createdBy: notification.createdBy,
      },
    });

    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getNotificationAnalytics = async (req, res) => {
  try {
    const analytics = await NotificationAnalytics.find({
      schoolId: req.user.schoolId,
    })
      .sort({ createdAt: -1 })
      .populate("createdBy", "name role");

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getNotifications,
  createNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getNotificationAnalytics,
};
