const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    schoolId: {
      type: String,
      required: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    creatorRole: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["event", "birthday", "holiday", "achievement", "emergency", "general"],
      default: "general",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    targetRoles: {
      type: [String],
      default: [],
    },
    targetScope: {
      type: String,
      enum: ["department", "institution", "role"],
      default: "institution",
    },
    targetDepartmentId: {
      type: String,
      default: "",
    },
    priority: {
      type: String,
      enum: ["standard", "important", "urgent"],
      default: "standard",
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
    isRead: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

notificationSchema.index({ schoolId: 1, createdAt: -1 });
notificationSchema.index({ schoolId: 1, targetRoles: 1 });

module.exports = mongoose.model("Notification", notificationSchema);
