const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const locationSchema = new mongoose.Schema(
  {
    building: {
      type: String,
      default: "",
    },
    officeRoom: {
      type: String,
      default: "",
    },
    teachingRooms: {
      type: [String],
      default: [],
    },
    floor: {
      type: String,
      default: "",
    },
    mapCoordinates: {
      lat: {
        type: Number,
        default: null,
      },
      lng: {
        type: Number,
        default: null,
      },
    },
  },
  { _id: false },
);

const customFieldSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: String,
      required: true,
      trim: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    schoolId: {
      type: String,
      required: true,
      default: "aditya-university",
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [
        "superadmin",
        "admin",
        "principal",
        "hod",
        "teacher",
        "support",
        "student",
        "parent",
        "visitor",
      ],
      required: true,
    },
    profilePhoto: {
      type: String,
      default: "https://picsum.photos/200",
    },
    department: {
      type: String,
      default: "",
      index: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    title: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    qualifications: {
      type: String,
      default: "",
    },
    subjects: {
      type: [String],
      default: [],
    },
    location: {
      type: locationSchema,
      default: () => ({}),
    },
    isRepresentative: {
      type: Boolean,
      default: false,
    },
    isDeputyAdmin: {
      type: Boolean,
      default: false,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    customFields: {
      type: [customFieldSchema],
      default: [],
    },
    departmentDescription: {
      type: String,
      default: "",
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    birthday: {
      type: String,
      default: "",
    },
    birthdayPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ schoolId: 1, role: 1 });
userSchema.index({ schoolId: 1, department: 1 });
userSchema.index({ schoolId: 1, parentId: 1 });

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to check password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
