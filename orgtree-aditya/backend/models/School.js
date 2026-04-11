const mongoose = require("mongoose");

const academicCalendarItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      default: null,
    },
    type: {
      type: String,
      default: "general",
      trim: true,
    },
  },
  { _id: false },
);

const wordOfDaySchema = new mongoose.Schema(
  {
    word: {
      type: String,
      default: "",
    },
    meaning: {
      type: String,
      default: "",
    },
    usage: {
      type: String,
      default: "",
    },
    updatedAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false },
);

const schoolSchema = new mongoose.Schema(
  {
    schoolId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    logoUrl: {
      type: String,
      default: "",
    },
    accreditation: {
      type: String,
      default: "",
    },
    established: {
      type: Number,
      default: null,
    },
    adminUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    subscriptionStatus: {
      type: String,
      enum: ["trial", "active", "expired"],
      default: "trial",
    },
    isFrozen: {
      type: Boolean,
      default: false,
      index: true,
    },
    frozenAt: {
      type: Date,
      default: null,
    },
    freezeReason: {
      type: String,
      default: "",
      trim: true,
    },
    contactPhone: {
      type: String,
      default: "",
    },
    contactEmail: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    visitingHours: {
      type: String,
      default: "",
    },
    socialLinks: {
      type: [String],
      default: [],
    },
    academicCalendar: {
      type: [academicCalendarItemSchema],
      default: [],
    },
    wordOfDay: {
      type: wordOfDaySchema,
      default: () => ({}),
    },
    defaultNotificationExpiry: {
      type: Number,
      default: 7,
    },
    whitelistEmails: {
      type: [String],
      default: [],
    },
    whitelistIds: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("School", schoolSchema);
