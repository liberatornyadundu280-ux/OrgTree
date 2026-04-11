const mongoose = require("mongoose");

const messageQueueSchema = new mongoose.Schema(
  {
    notificationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notification",
      required: true,
      index: true,
    },
    schoolId: {
      type: String,
      required: true,
      index: true,
    },
    channel: {
      type: String,
      enum: ["email", "whatsapp", "sms"],
      required: true,
      index: true,
    },
    recipient: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
      index: true,
    },
    retryCount: {
      type: Number,
      default: 0,
    },
    scheduledAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    sentAt: {
      type: Date,
      default: null,
    },
    lastError: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

messageQueueSchema.index({ status: 1, scheduledAt: 1 });
messageQueueSchema.index({ schoolId: 1, createdAt: -1 });

module.exports = mongoose.model("MessageQueue", messageQueueSchema);
