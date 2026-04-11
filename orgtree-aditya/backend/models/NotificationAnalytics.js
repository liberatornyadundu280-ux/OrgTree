const mongoose = require("mongoose");

const notificationAnalyticsSchema = new mongoose.Schema(
  {
    schoolId: {
      type: String,
      required: true,
      index: true,
    },
    notificationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notification",
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    audienceSize: {
      type: Number,
      default: 0,
    },
    readCount: {
      type: Number,
      default: 0,
    },
    channel: {
      type: String,
      default: "in-app",
      trim: true,
    },
    expiredAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

notificationAnalyticsSchema.index({ schoolId: 1, createdAt: -1 });

module.exports = mongoose.model(
  "NotificationAnalytics",
  notificationAnalyticsSchema,
);
