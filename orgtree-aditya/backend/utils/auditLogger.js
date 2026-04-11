const AuditLog = require("../models/AuditLog");

const getRequestIp = (req) =>
  req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
  req.socket?.remoteAddress ||
  "";

const logAudit = async (
  req,
  {
    action,
    targetId = null,
    targetType,
    requestType = "",
    requestStatus = "",
    requestNote = "",
    metadata = {},
  },
) => {
  if (!req.user) {
    return null;
  }

  return AuditLog.create({
    schoolId: req.user.schoolId,
    userId: req.user._id,
    action,
    targetId,
    targetType,
    requestType,
    requestStatus,
    requestNote,
    metadata,
    ipAddress: getRequestIp(req),
  });
};

module.exports = { logAudit };
