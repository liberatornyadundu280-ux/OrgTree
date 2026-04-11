const mongoose = require("mongoose");

const coordinateSchema = new mongoose.Schema(
  {
    lat: {
      type: Number,
      default: null,
    },
    lng: {
      type: Number,
      default: null,
    },
  },
  { _id: false },
);

const mapPositionSchema = new mongoose.Schema(
  {
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const buildingSchema = new mongoose.Schema(
  {
    buildingId: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    coordinates: {
      type: coordinateSchema,
      default: () => ({}),
    },
    mapPosition: {
      type: mapPositionSchema,
      required: true,
    },
    floors: {
      type: Number,
      default: 1,
    },
    entryPoints: {
      type: [String],
      default: [],
    },
    prominentOccupantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    publicFacilities: {
      type: [String],
      default: [],
    },
    departments: {
      type: [String],
      default: [],
    },
    roomNumbers: {
      type: [String],
      default: [],
    },
  },
  { _id: false },
);

const campusMapSchema = new mongoose.Schema(
  {
    schoolId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    mapImageUrl: {
      type: String,
      required: true,
    },
    mapBoundary: {
      northEast: {
        type: coordinateSchema,
        default: () => ({}),
      },
      southWest: {
        type: coordinateSchema,
        default: () => ({}),
      },
    },
    buildings: {
      type: [buildingSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("CampusMap", campusMapSchema);
