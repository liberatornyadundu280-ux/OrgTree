const mongoose = require("mongoose");
const User = require("../models/User");
const { logAudit } = require("../utils/auditLogger");

const adminRoles = ["admin", "superadmin"];
const restrictedViewerRoles = ["student", "parent", "visitor"];

const isSameId = (firstId, secondId) => firstId.toString() === secondId.toString();

const findUserInCurrentSchool = async (userId, schoolId) =>
  mongoose.isValidObjectId(userId)
    ? User.findOne({
        _id: userId,
        schoolId,
        isActive: true,
      }).select("-password")
    : null;

const getSafeProfile = (viewerRole, user) => {
  const userObject = user.toObject ? user.toObject() : user;

  if (!restrictedViewerRoles.includes(viewerRole)) {
    return userObject;
  }

  return {
    _id: userObject._id,
    name: userObject.name,
    title: userObject.title,
    department: userObject.department,
    profilePhoto: userObject.profilePhoto,
    bio: userObject.bio,
    qualifications: userObject.qualifications,
    subjects: userObject.subjects,
    role: userObject.role,
    location: userObject.location,
    customFields: userObject.customFields?.filter((field) => field.isPublic),
  };
};

const validateParent = async (parentId, schoolId) => {
  if (!parentId) {
    return true;
  }

  if (!mongoose.isValidObjectId(parentId)) {
    return false;
  }

  const parent = await User.findOne({
    _id: parentId,
    schoolId,
    isActive: true,
  }).select("_id");

  return Boolean(parent);
};

const createUserFromPayload = async (payload, schoolId) => {
  const {
    name,
    email,
    password,
    role,
    profilePhoto,
    department,
    parentId,
    title,
    bio,
    qualifications,
    subjects,
    location,
    isRepresentative,
    customFields,
    departmentDescription,
    joinDate,
    birthday,
    birthdayPublic,
  } = payload;

  return User.create({
    schoolId,
    name,
    email,
    password,
    role,
    profilePhoto,
    department,
    parentId: parentId || null,
    title,
    bio,
    qualifications,
    subjects,
    location,
    isRepresentative,
    customFields,
    departmentDescription,
    joinDate,
    birthday,
    birthdayPublic,
  });
};

// @desc    Get all users for the authenticated school
// @route   GET /api/users
// @access  Protected
const getUsers = async (req, res) => {
  try {
    const users = await User.find({
      schoolId: req.user.schoolId,
      isActive: true,
    }).select("-password");

    res.json(users.map((user) => getSafeProfile(req.user.role, user)));
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Add one member to the authenticated school
// @route   POST /api/users
// @access  Admin only
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, parentId } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Name, email, password, and role are required",
      });
    }

    const parentIsValid = await validateParent(parentId, req.user.schoolId);

    if (!parentIsValid) {
      return res.status(400).json({ message: "Parent must belong to this school" });
    }

    const user = await createUserFromPayload(req.body, req.user.schoolId);
    await logAudit(req, {
      action: "userCreate",
      targetId: user._id,
      targetType: "user",
      metadata: { role: user.role, email: user.email },
    });
    const safeUser = user.toObject();
    delete safeUser.password;

    res.status(201).json(safeUser);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }

    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Bulk create users for onboarding
// @route   POST /api/users/bulk
// @access  Admin only
const bulkCreateUsers = async (req, res) => {
  try {
    const { users } = req.body;

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ message: "Users array is required" });
    }

    const created = [];
    const errors = [];

    for (const [index, payload] of users.entries()) {
      try {
        const { name, email, password, role, parentId } = payload;

        if (!name || !email || !password || !role) {
          errors.push({
            index,
            email,
            message: "Name, email, password, and role are required",
          });
          continue;
        }

        const parentIsValid = await validateParent(parentId, req.user.schoolId);

        if (!parentIsValid) {
          errors.push({
            index,
            email,
            message: "Parent must belong to this school",
          });
          continue;
        }

        const user = await createUserFromPayload(payload, req.user.schoolId);
        created.push(user._id);
        await logAudit(req, {
          action: "userBulkCreate",
          targetId: user._id,
          targetType: "user",
          metadata: { role: user.role, email: user.email, sourceIndex: index },
        });
      } catch (error) {
        errors.push({
          index,
          email: payload.email,
          message: error.code === 11000 ? "Email already exists" : error.message,
        });
      }
    }

    res.status(201).json({
      successCount: created.length,
      errorCount: errors.length,
      created,
      errors,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get significant role nodes for org tree rendering
// @route   GET /api/users/tree
// @access  Protected
const getOrgTree = async (req, res) => {
  try {
    const treeRoles = ["principal", "hod", "admin"];

    const treeNodes = await User.find({
      schoolId: req.user.schoolId,
      isActive: true,
      $or: [{ role: { $in: treeRoles } }, { isRepresentative: true }],
    }).select("-password");

    res.json(treeNodes.map((user) => getSafeProfile(req.user.role, user)));
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get computed department cards from HOD documents
// @route   GET /api/users/departments
// @access  Protected
const getDepartments = async (req, res) => {
  try {
    const hods = await User.find({
      schoolId: req.user.schoolId,
      role: "hod",
      isActive: true,
    }).select("-password");

    const departments = await Promise.all(
      hods.map(async (hod) => {
        const memberCount = await User.countDocuments({
          schoolId: req.user.schoolId,
          department: hod.department,
          isActive: true,
        });

        return {
          department: hod.department,
          description: hod.departmentDescription,
          hod: getSafeProfile(req.user.role, hod),
          memberCount,
        };
      }),
    );

    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get children of a specific node
// @route   GET /api/users/:id/children
// @access  Protected
const getChildren = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "User not found" });
    }

    const children = await User.find({
      schoolId: req.user.schoolId,
      parentId: req.params.id,
      isActive: true,
    }).select("-password");

    res.json(children.map((user) => getSafeProfile(req.user.role, user)));
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get single user profile
// @route   GET /api/users/:id
// @access  Protected
const getUserById = async (req, res) => {
  try {
    const user = await findUserInCurrentSchool(req.params.id, req.user.schoolId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(getSafeProfile(req.user.role, user));
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Admin update any user profile field inside current school
// @route   PUT /api/users/:id
// @access  Admin only
const updateUser = async (req, res) => {
  try {
    const user = await findUserInCurrentSchool(req.params.id, req.user.schoolId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const parentIsValid = await validateParent(req.body.parentId, req.user.schoolId);

    if (!parentIsValid) {
      return res.status(400).json({ message: "Parent must belong to this school" });
    }

    const allowedFields = [
      "name",
      "email",
      "password",
      "role",
      "profilePhoto",
      "department",
      "parentId",
      "title",
      "bio",
      "qualifications",
      "subjects",
      "location",
      "isRepresentative",
      "isDeputyAdmin",
      "isActive",
      "customFields",
      "departmentDescription",
      "joinDate",
      "birthday",
      "birthdayPublic",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();
    await logAudit(req, {
      action: "userUpdate",
      targetId: user._id,
      targetType: "user",
      metadata: {
        updatedFields: allowedFields.filter((field) => req.body[field] !== undefined),
      },
    });

    const safeUser = user.toObject();
    delete safeUser.password;

    res.json(safeUser);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }

    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Self-update profile fields only
// @route   PUT /api/users/:id/profile
// @access  Authenticated user
const updateOwnProfile = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id) || !isSameId(req.params.id, req.user._id)) {
      return res.status(403).json({ message: "You can only update your own profile" });
    }

    const user = await findUserInCurrentSchool(req.params.id, req.user.schoolId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const allowedFields = [
      "bio",
      "profilePhoto",
      "customFields",
      "birthday",
      "birthdayPublic",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;

    res.json(safeUser);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Deactivate user account while preserving records
// @route   PUT /api/users/:id/deactivate
// @access  Admin only
const deactivateUser = async (req, res) => {
  try {
    const user = await findUserInCurrentSchool(req.params.id, req.user.schoolId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = false;
    await user.save();
    await logAudit(req, {
      action: "userDeactivate",
      targetId: user._id,
      targetType: "user",
      requestStatus: "approved",
      requestNote: req.body.reason?.trim() || "",
      metadata: { email: user.email, role: user.role },
    });

    res.json({ message: "User deactivated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get department members
// @route   GET /api/users/department/:dept
// @access  Protected
const getDepartmentMembers = async (req, res) => {
  try {
    const members = await User.find({
      schoolId: req.user.schoolId,
      department: req.params.dept,
      isActive: true,
    }).select("-password");

    res.json(members.map((user) => getSafeProfile(req.user.role, user)));
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getUsers,
  createUser,
  bulkCreateUsers,
  getOrgTree,
  getDepartments,
  getChildren,
  getUserById,
  updateUser,
  updateOwnProfile,
  deactivateUser,
  getDepartmentMembers,
};
