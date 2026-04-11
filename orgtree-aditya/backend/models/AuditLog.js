const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    schoolId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    targetType: {
      type: String,
      required: true,
      trim: true,
    },
    requestType: {
      type: String,
      default: "",
      trim: true,
    },
    requestStatus: {
      type: String,
      enum: ["pending", "approved", "rejected", ""],
      default: "",
    },
    requestNote: {
      type: String,
      default: "",
      trim: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

auditLogSchema.index({ schoolId: 1, createdAt: -1 });
auditLogSchema.index({ schoolId: 1, targetType: 1, targetId: 1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
