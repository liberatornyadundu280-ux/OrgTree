const Achievement = require("../models/Achievement");
const User = require("../models/User");
const mongoose = require("mongoose");

const adminRoles = ["admin", "superadmin"];

const isSameId = (firstId, secondId) => firstId.toString() === secondId.toString();

const canManageAchievement = (req, achievement) =>
  isSameId(achievement.userId, req.user._id) || adminRoles.includes(req.user.role);

const findUserInCurrentSchool = async (userId, schoolId) =>
  mongoose.isValidObjectId(userId)
    ? User.findOne({
        _id: userId,
        schoolId,
        isActive: true,
      }).select("_id schoolId")
    : null;

const findAchievementInCurrentSchool = async (achievementId, schoolId) =>
  mongoose.isValidObjectId(achievementId)
    ? Achievement.findOne({
        _id: achievementId,
        schoolId,
      })
    : null;

const getMyAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find({
      userId: req.user._id,
      schoolId: req.user.schoolId,
    }).sort({ date: -1 });

    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getAchievementsByUser = async (req, res) => {
  try {
    const user = await findUserInCurrentSchool(req.params.userId, req.user.schoolId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const canSeePrivate =
      isSameId(user._id, req.user._id) || adminRoles.includes(req.user.role);

    const achievements = await Achievement.find({
      userId: req.params.userId,
      schoolId: req.user.schoolId,
      ...(canSeePrivate ? {} : { isPublic: true }),
    }).sort({ date: -1 });

    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const createAchievement = async (req, res) => {
  try {
    const { userId, title, description, date, category, isPublic } = req.body;

    if (!title || !date) {
      return res.status(400).json({ message: "Title and date are required" });
    }

    const targetUserId = userId || req.user._id;
    const isCreatingForSelf = isSameId(targetUserId, req.user._id);

    if (!isCreatingForSelf && !adminRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Only admins can create achievements for another user",
      });
    }

    const targetUser = await findUserInCurrentSchool(targetUserId, req.user.schoolId);

    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found" });
    }

    const achievement = await Achievement.create({
      userId: targetUser._id,
      schoolId: req.user.schoolId,
      title,
      description,
      date,
      category,
      isPublic,
    });

    res.status(201).json(achievement);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateAchievement = async (req, res) => {
  try {
    const achievement = await findAchievementInCurrentSchool(
      req.params.id,
      req.user.schoolId,
    );

    if (!achievement) {
      return res.status(404).json({ message: "Achievement not found" });
    }

    if (!canManageAchievement(req, achievement)) {
      return res.status(403).json({
        message: "You can only update your own achievements",
      });
    }

    const allowedFields = ["title", "description", "date", "category", "isPublic"];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        achievement[field] = req.body[field];
      }
    });

    await achievement.save();

    res.json(achievement);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteAchievement = async (req, res) => {
  try {
    const achievement = await findAchievementInCurrentSchool(
      req.params.id,
      req.user.schoolId,
    );

    if (!achievement) {
      return res.status(404).json({ message: "Achievement not found" });
    }

    if (!canManageAchievement(req, achievement)) {
      return res.status(403).json({
        message: "You can only delete your own achievements",
      });
    }

    await achievement.deleteOne();

    res.json({ message: "Achievement deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getMyAchievements,
  getAchievementsByUser,
  createAchievement,
  updateAchievement,
  deleteAchievement,
};
