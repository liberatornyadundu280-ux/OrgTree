const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/userController");
const { protect, authorise } = require("../middleware/authMiddleware");

router.get("/", protect, getUsers);
router.post("/", protect, authorise("admin", "superadmin"), createUser);
router.post("/bulk", protect, authorise("admin", "superadmin"), bulkCreateUsers);
router.get("/tree", protect, getOrgTree);
router.get("/departments", protect, getDepartments);
router.get("/department/:dept", protect, getDepartmentMembers);
router.put("/:id/profile", protect, updateOwnProfile);
router.put(
  "/:id/deactivate",
  protect,
  authorise("admin", "superadmin"),
  deactivateUser,
);
router.get("/:id/children", protect, getChildren);
router.get("/:id", protect, getUserById);
router.put("/:id", protect, authorise("admin", "superadmin"), updateUser);

module.exports = router;
