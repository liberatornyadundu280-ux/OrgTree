const CampusMap = require("../models/CampusMap");
const User = require("../models/User");
const { logAudit } = require("../utils/auditLogger");

const getCampusMap = async (req, res) => {
  try {
    const campusMap = await CampusMap.findOne({
      schoolId: req.user.schoolId,
    }).populate("buildings.prominentOccupantId", "name role title department profilePhoto");

    if (!campusMap) {
      return res.status(404).json({ message: "Campus map not found" });
    }

    res.json(campusMap);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getBuildingById = async (req, res) => {
  try {
    const campusMap = await CampusMap.findOne({
      schoolId: req.user.schoolId,
    }).populate("buildings.prominentOccupantId", "name role title department profilePhoto");

    if (!campusMap) {
      return res.status(404).json({ message: "Campus map not found" });
    }

    const building = campusMap.buildings.find(
      (item) => item.buildingId === req.params.buildingId,
    );

    if (!building) {
      return res.status(404).json({ message: "Building not found" });
    }

    const occupants = await User.find({
      schoolId: req.user.schoolId,
      "location.building": building.name,
      isActive: true,
    }).select("name role title department profilePhoto location");

    res.json({
      building,
      occupants,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const upsertCampusMap = async (req, res) => {
  try {
    const { mapImageUrl, mapBoundary, buildings } = req.body;

    if (!mapImageUrl) {
      return res.status(400).json({ message: "Map image URL is required" });
    }

    const campusMap = await CampusMap.findOneAndUpdate(
      { schoolId: req.user.schoolId },
      {
        schoolId: req.user.schoolId,
        mapImageUrl,
        mapBoundary,
        buildings,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );
    await logAudit(req, {
      action: "campusMapUpdate",
      targetId: campusMap._id,
      targetType: "campusMap",
      metadata: {
        buildingCount: campusMap.buildings.length,
      },
    });

    res.json(campusMap);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getCampusMap,
  getBuildingById,
  upsertCampusMap,
};
