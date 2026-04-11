const mongoose = require("mongoose");
const AdminMessage = require("../models/AdminMessage");
const AuditLog = require("../models/AuditLog");
const MessageQueue = require("../models/MessageQueue");
const User = require("../models/User");
const { logAudit } = require("../utils/auditLogger");

const adminMessageSenderRoles = ["principal", "hod", "teacher"];

const canSendAdminMessage = (user) =>
  adminMessageSenderRoles.includes(user.role) || user.isRepresentative;

const getAdminMessages = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {
      schoolId: req.user.schoolId,
    };

    if (status) {
      query.status = status;
    }

    const messages = await AdminMessage.find(query)
      .sort({ createdAt: -1 })
      .populate("fromUserId", "name role title department profilePhoto")
      .populate("resolvedBy", "name role");

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const createAdminMessage = async (req, res) => {
  try {
    if (!canSendAdminMessage(req.user)) {
      return res.status(403).json({
        message: "Only root leaders or representatives can message the admin",
      });
    }

    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const adminMessage = await AdminMessage.create({
      schoolId: req.user.schoolId,
      fromUserId: req.user._id,
      fromRole: req.user.role,
      message,
    });

    res.status(201).json(adminMessage);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const resolveAdminMessage = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Admin message not found" });
    }

    const adminMessage = await AdminMessage.findOne({
      _id: req.params.id,
      schoolId: req.user.schoolId,
    });

    if (!adminMessage) {
      return res.status(404).json({ message: "Admin message not found" });
    }

    adminMessage.status = "resolved";
    adminMessage.resolvedAt = new Date();
    adminMessage.resolvedBy = req.user._id;
    adminMessage.resolutionNote = req.body.resolutionNote?.trim() || "";
    await adminMessage.save();
    await logAudit(req, {
      action: "adminMessageResolve",
      targetId: adminMessage._id,
      targetType: "adminMessage",
      requestStatus: "approved",
      requestNote: adminMessage.resolutionNote,
      metadata: { fromRole: adminMessage.fromRole },
    });

    res.json(adminMessage);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getAuditLog = async (req, res) => {
  try {
    const { action, targetType } = req.query;
    const query = {
      schoolId: req.user.schoolId,
    };

    if (action) {
      query.action = action;
    }

    if (targetType) {
      query.targetType = targetType;
    }

    const logs = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .populate("userId", "name role email");

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getMessageQueue = async (req, res) => {
  try {
    const { status, channel } = req.query;
    const query = {
      schoolId: req.user.schoolId,
    };

    if (status) {
      query.status = status;
    }

    if (channel) {
      query.channel = channel;
    }

    const queueItems = await MessageQueue.find(query)
      .sort({ scheduledAt: 1 })
      .populate("notificationId", "title type priority expiresAt");

    res.json(queueItems);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const assignDeputyAdmin = async (req, res) => {
  try {
    if (!["admin", "superadmin"].includes(req.user.role)) {
      return res.status(403).json({
        message: "Only an admin or superadmin can assign deputy admins",
      });
    }

    const { userId, enabled = true } = req.body;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Valid userId is required" });
    }

    const user = await User.findOne({
      _id: userId,
      schoolId: req.user.schoolId,
      isActive: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "superadmin") {
      return res.status(400).json({ message: "Super admin cannot be a deputy admin" });
    }

    user.isDeputyAdmin = Boolean(enabled);
    await user.save();
    await logAudit(req, {
      action: user.isDeputyAdmin ? "deputyAdminAssign" : "deputyAdminRemove",
      targetId: user._id,
      targetType: "user",
      requestStatus: "approved",
      requestNote: req.body.reason?.trim() || "",
      metadata: {
        email: user.email,
        role: user.role,
      },
    });

    res.json({
      message: user.isDeputyAdmin
        ? "Deputy admin assigned successfully"
        : "Deputy admin removed successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAdminMessages,
  createAdminMessage,
  resolveAdminMessage,
  getAuditLog,
  getMessageQueue,
  assignDeputyAdmin,
};
