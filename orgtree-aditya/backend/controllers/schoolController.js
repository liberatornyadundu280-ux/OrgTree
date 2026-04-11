const School = require("../models/School");
const { logAudit } = require("../utils/auditLogger");

const canManageSchool = (req, schoolId) => {
  if (req.user.role === "superadmin") {
    return true;
  }

  return req.user.role === "admin" && req.user.schoolId === schoolId;
};

const allowedUpdateFields = [
  "name",
  "location",
  "logoUrl",
  "accreditation",
  "established",
  "adminUserId",
  "subscriptionStatus",
  "contactPhone",
  "contactEmail",
  "website",
  "visitingHours",
  "socialLinks",
  "academicCalendar",
  "wordOfDay",
  "defaultNotificationExpiry",
  "whitelistEmails",
  "whitelistIds",
];

const listSchools = async (req, res) => {
  try {
    const schools = await School.find({}).sort({ createdAt: -1 });

    res.json(schools);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getCurrentSchool = async (req, res) => {
  try {
    const school = await School.findOne({ schoolId: req.user.schoolId });

    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    res.json(school);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getSchoolById = async (req, res) => {
  try {
    const school = await School.findOne({ schoolId: req.params.schoolId });

    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    res.json(school);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const createSchool = async (req, res) => {
  try {
    const { schoolId, name, location } = req.body;

    if (!schoolId || !name || !location) {
      return res.status(400).json({
        message: "schoolId, name, and location are required",
      });
    }

    const school = await School.create(req.body);
    await logAudit(req, {
      action: "schoolCreate",
      targetId: school._id,
      targetType: "school",
      requestStatus: "approved",
      metadata: { schoolId: school.schoolId, name: school.name },
    });

    res.status(201).json(school);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "School ID already exists" });
    }

    res.status(500).json({ message: "Server error" });
  }
};

const updateSchool = async (req, res) => {
  try {
    const school = await School.findOne({ schoolId: req.params.schoolId });

    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    if (!canManageSchool(req, school.schoolId)) {
      return res.status(403).json({ message: "Not authorised to update this school" });
    }

    allowedUpdateFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        school[field] = req.body[field];
      }
    });

    await school.save();
    await logAudit(req, {
      action: "schoolUpdate",
      targetId: school._id,
      targetType: "school",
      metadata: {
        schoolId: school.schoolId,
        updatedFields: allowedUpdateFields.filter(
          (field) => req.body[field] !== undefined,
        ),
      },
    });

    res.json(school);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const freezeSchool = async (req, res) => {
  try {
    const school = await School.findOne({ schoolId: req.params.schoolId });

    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    if (!canManageSchool(req, school.schoolId)) {
      return res.status(403).json({ message: "Not authorised to freeze this school" });
    }

    school.isFrozen = true;
    school.frozenAt = new Date();
    school.freezeReason = req.body.freezeReason?.trim() || "";
    await school.save();
    await logAudit(req, {
      action: "schoolFreeze",
      targetId: school._id,
      targetType: "school",
      requestStatus: "approved",
      requestNote: school.freezeReason,
      metadata: { schoolId: school.schoolId },
    });

    res.json({
      message: `${school.name} has been frozen successfully`,
      school,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const unfreezeSchool = async (req, res) => {
  try {
    const school = await School.findOne({ schoolId: req.params.schoolId });

    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    if (!canManageSchool(req, school.schoolId)) {
      return res.status(403).json({ message: "Not authorised to unfreeze this school" });
    }

    school.isFrozen = false;
    school.frozenAt = null;
    school.freezeReason = "";
    await school.save();
    await logAudit(req, {
      action: "schoolUnfreeze",
      targetId: school._id,
      targetType: "school",
      requestStatus: "approved",
      metadata: { schoolId: school.schoolId },
    });

    res.json({
      message: `${school.name} has been unfrozen successfully`,
      school,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  listSchools,
  getCurrentSchool,
  getSchoolById,
  createSchool,
  updateSchool,
  freezeSchool,
  unfreezeSchool,
};
