const dotenv = require("dotenv");
const mongoose = require("mongoose");
const School = require("./models/School");
const User = require("./models/User");
const Achievement = require("./models/Achievement");
const Notification = require("./models/Notification");
const NotificationAnalytics = require("./models/NotificationAnalytics");
const CampusMap = require("./models/CampusMap");
const AdminMessage = require("./models/AdminMessage");
const AuditLog = require("./models/AuditLog");
const MessageQueue = require("./models/MessageQueue");

dotenv.config();

const schoolSeed = {
  schoolId: "aditya-university",
  name: "Aditya University",
  location: "Surampalem, East Godavari District, Andhra Pradesh, India",
  logoUrl: "https://picsum.photos/seed/aditya-logo/200",
  accreditation: "NAAC A++",
  established: 2016,
  subscriptionStatus: "active",
  contactPhone: "+91-00000-00000",
  contactEmail: "info@aditya.edu",
  website: "https://www.adityauniversity.in",
  visitingHours: "9:00 AM - 5:00 PM",
  socialLinks: ["https://www.linkedin.com/school/aditya-university/"],
  academicCalendar: [
    {
      title: "Odd Semester",
      startDate: new Date("2026-06-15"),
      endDate: new Date("2026-11-15"),
      type: "semester",
    },
  ],
  wordOfDay: {
    word: "Hierarchy",
    meaning: "A system where people or things are arranged in levels.",
    usage: "The university hierarchy is visible in OrgTree.",
    updatedAt: new Date(),
  },
  defaultNotificationExpiry: 7,
  whitelistEmails: ["admin@aditya.edu", "principal@aditya.edu"],
  whitelistIds: ["EMP-001", "EMP-002"],
};

const seedUsers = [
  {
    name: "Dr. Rajesh Kumar Sharma",
    email: "principal@aditya.edu",
    password: "admin123",
    role: "principal",
    title: "Vice Chancellor",
    department: "Administration",
    bio: "Dr. Sharma has over 25 years of experience in academia and has led Aditya University to NAAC A++ accreditation.",
    qualifications: "Ph.D in Computer Science, IIT Bombay",
    profilePhoto: "https://picsum.photos/seed/principal/200",
    location: {
      building: "Administration Block",
      officeRoom: "101",
      floor: "1",
    },
  },
  {
    name: "Mrs. Lakshmi Devi",
    email: "admin@aditya.edu",
    password: "admin123",
    role: "admin",
    title: "System Administrator",
    department: "Administration",
    bio: "Mrs. Devi manages all administrative operations and digital systems at Aditya University.",
    qualifications: "M.Sc in Information Technology",
    profilePhoto: "https://picsum.photos/seed/admin/200",
    customFields: [
      { key: "Shift", value: "Morning", isPublic: false },
    ],
  },
  {
    name: "Dr. Venkata Subrahmanyam",
    email: "hod.cse@aditya.edu",
    password: "admin123",
    role: "hod",
    title: "Head of Department - Computer Science & Engineering",
    department: "Computer Science & Engineering",
    bio: "Dr. Subrahmanyam leads the CSE department with expertise in AI and Machine Learning.",
    qualifications: "Ph.D in Computer Science, NIT Warangal",
    subjects: [
      "Artificial Intelligence",
      "Machine Learning",
      "Data Structures",
    ],
    departmentDescription:
      "Leads academic and research planning for Computer Science and Engineering.",
    profilePhoto: "https://picsum.photos/seed/hodcse/200",
  },
  {
    name: "Dr. Srinivasa Rao Patel",
    email: "hod.ece@aditya.edu",
    password: "admin123",
    role: "hod",
    title: "Head of Department - Electronics & Communication",
    department: "Electronics & Communication Engineering",
    bio: "Dr. Patel brings 20 years of industry and academic experience in VLSI and Embedded Systems.",
    qualifications: "Ph.D in Electronics, Andhra University",
    subjects: ["VLSI Design", "Embedded Systems", "Digital Electronics"],
    departmentDescription:
      "Coordinates the ECE curriculum, labs, and faculty planning.",
    profilePhoto: "https://picsum.photos/seed/hodece/200",
  },
  {
    name: "Dr. Annapurna Krishnamurthy",
    email: "hod.pharmacy@aditya.edu",
    password: "admin123",
    role: "hod",
    title: "Head of Department - Pharmacy",
    department: "Pharmacy",
    bio: "Dr. Krishnamurthy is a renowned pharmacologist with multiple research publications.",
    qualifications: "Ph.D in Pharmaceutical Sciences, Manipal University",
    subjects: ["Pharmacology", "Pharmaceutical Chemistry"],
    departmentDescription:
      "Oversees pharmacy academics, compliance, and research outputs.",
    profilePhoto: "https://picsum.photos/seed/hodpharm/200",
  },
  {
    name: "Dr. Prasad Naidu",
    email: "hod.business@aditya.edu",
    password: "admin123",
    role: "hod",
    title: "Head of Department - Business Administration",
    department: "Business Administration",
    bio: "Dr. Naidu combines academic excellence with real-world business consulting experience.",
    qualifications: "Ph.D in Management, XLRI Jamshedpur",
    subjects: ["Strategic Management", "Business Analytics", "Finance"],
    departmentDescription:
      "Manages business school strategy, faculty coordination, and student development.",
    profilePhoto: "https://picsum.photos/seed/hodbusiness/200",
  },
  {
    name: "Mr. Kiran Kumar Reddy",
    email: "kiran.reddy@aditya.edu",
    password: "admin123",
    role: "teacher",
    title: "Assistant Professor - CSE",
    department: "Computer Science & Engineering",
    bio: "Mr. Reddy specialises in full stack web development and cloud computing.",
    qualifications: "M.Tech in Computer Science, JNTU Kakinada",
    subjects: ["Web Technologies", "Cloud Computing", "DBMS"],
    profilePhoto: "https://picsum.photos/seed/kiran/200",
    customFields: [
      { key: "Office Hours", value: "Mon-Wed 2 PM to 4 PM", isPublic: true },
    ],
  },
  {
    name: "Ms. Divya Bharathi",
    email: "divya.bharathi@aditya.edu",
    password: "admin123",
    role: "teacher",
    title: "Assistant Professor - CSE",
    department: "Computer Science & Engineering",
    bio: "Ms. Bharathi is passionate about cybersecurity and digital forensics research.",
    qualifications: "M.Tech in Cybersecurity, VIT Vellore",
    subjects: ["Cybersecurity", "Digital Forensics", "Computer Networks"],
    profilePhoto: "https://picsum.photos/seed/divya/200",
  },
  {
    name: "Mr. Anil Varma",
    email: "anil.varma@aditya.edu",
    password: "admin123",
    role: "teacher",
    title: "Associate Professor - ECE",
    department: "Electronics & Communication Engineering",
    bio: "Mr. Varma has industry experience at Qualcomm and specialises in signal processing.",
    qualifications: "M.Tech in Signal Processing, IIT Kharagpur",
    subjects: ["Signal Processing", "Communication Systems", "Antenna Design"],
    profilePhoto: "https://picsum.photos/seed/anil/200",
  },
  {
    name: "Mr. Ravi Shankar",
    email: "librarian@aditya.edu",
    password: "admin123",
    role: "support",
    title: "Chief Librarian",
    department: "Library & Learning Resources",
    bio: "Mr. Shankar manages the university library with over 50,000 volumes and digital resources.",
    qualifications: "M.Lib in Library Science, Andhra University",
    profilePhoto: "https://picsum.photos/seed/ravi/200",
  },
  {
    name: "Dr. Padmavathi Rao",
    email: "nurse@aditya.edu",
    password: "admin123",
    role: "support",
    title: "University Medical Officer",
    department: "Health & Wellness Centre",
    bio: "Dr. Padmavathi oversees the health and wellness of all students and staff at Aditya University.",
    qualifications: "MBBS, Andhra Medical College",
    profilePhoto: "https://picsum.photos/seed/padma/200",
  },
  {
    name: "Arjun Sai Krishna",
    email: "arjun.sai@student.aditya.edu",
    password: "student123",
    role: "student",
    title: "B.Tech CSE - Year 3",
    department: "Computer Science & Engineering",
    bio: "Arjun is the CSE student representative and leads the university coding club.",
    qualifications: "B.Tech Computer Science & Engineering (ongoing)",
    profilePhoto: "https://picsum.photos/seed/arjun/200",
    isRepresentative: true,
    birthday: "09-12",
    birthdayPublic: true,
  },
  {
    name: "Priya Lakshmi Nair",
    email: "priya.nair@student.aditya.edu",
    password: "student123",
    role: "student",
    title: "B.Tech ECE - Year 2",
    department: "Electronics & Communication Engineering",
    bio: "Priya is passionate about robotics and is the president of the Robotics Club.",
    qualifications: "B.Tech Electronics & Communication (ongoing)",
    profilePhoto: "https://picsum.photos/seed/priya/200",
    isRepresentative: true,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for seeding...");

    await Notification.deleteMany({});
    await NotificationAnalytics.deleteMany({});
    await Achievement.deleteMany({});
    await CampusMap.deleteMany({});
    await AdminMessage.deleteMany({});
    await AuditLog.deleteMany({});
    await MessageQueue.deleteMany({});
    await User.deleteMany({});
    await School.deleteMany({});
    console.log("Existing data cleared...");

    const school = await School.create(schoolSeed);
    console.log("School created...");

    const principal = await User.create(seedUsers[0]);
    console.log("Principal created...");

    const admin = await User.create({ ...seedUsers[1], parentId: principal._id });
    school.adminUserId = admin._id;
    await school.save();
    console.log("Admin created...");

    const hodCSE = await User.create({ ...seedUsers[2], parentId: principal._id });
    const hodECE = await User.create({ ...seedUsers[3], parentId: principal._id });
    await User.create({ ...seedUsers[4], parentId: principal._id });
    await User.create({ ...seedUsers[5], parentId: principal._id });
    console.log("HODs created...");

    await User.create({ ...seedUsers[6], parentId: hodCSE._id });
    await User.create({ ...seedUsers[7], parentId: hodCSE._id });
    await User.create({ ...seedUsers[8], parentId: hodECE._id });
    console.log("Teachers created...");

    await User.create({ ...seedUsers[9], parentId: admin._id });
    await User.create({ ...seedUsers[10], parentId: admin._id });
    console.log("Support staff created...");

    const student1 = await User.create({ ...seedUsers[11], parentId: hodCSE._id });
    await User.create({ ...seedUsers[12], parentId: hodECE._id });
    console.log("Students created...");

    await Achievement.create({
      userId: hodCSE._id,
      schoolId: school.schoolId,
      title: "Best Department Research Grant",
      description: "Secured a university grant for AI research initiatives.",
      date: new Date("2025-12-10"),
      category: "award",
      isPublic: true,
    });

    await Achievement.create({
      userId: student1._id,
      schoolId: school.schoolId,
      title: "Hackathon Winner",
      description: "Won first place in the inter-university coding challenge.",
      date: new Date("2026-02-18"),
      category: "competition",
      isPublic: true,
    });

    const notification = await Notification.create({
      schoolId: school.schoolId,
      createdBy: admin._id,
      creatorRole: admin.role,
      type: "general",
      title: "Welcome to the new OrgTree backend",
      body: "The first structured collections for schools, achievements, and notifications are now active.",
      targetRoles: [],
      targetScope: "institution",
      priority: "important",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await NotificationAnalytics.create({
      schoolId: school.schoolId,
      notificationId: notification._id,
      type: notification.type,
      createdBy: admin._id,
      audienceSize: await User.countDocuments({
        schoolId: school.schoolId,
        isActive: true,
      }),
      readCount: 0,
      channel: "in-app",
      expiredAt: notification.expiresAt,
    });
    await MessageQueue.create({
      schoolId: school.schoolId,
      notificationId: notification._id,
      channel: "email",
      recipient: "admin@aditya.edu",
      status: "pending",
      scheduledAt: new Date(),
    });
    console.log("Achievements and notifications created...");

    await CampusMap.create({
      schoolId: school.schoolId,
      mapImageUrl: "https://picsum.photos/seed/aditya-campus-map/1200/800",
      mapBoundary: {
        northEast: { lat: 17.0878, lng: 82.0702 },
        southWest: { lat: 17.0798, lng: 82.0612 },
      },
      buildings: [
        {
          buildingId: "admin-block",
          name: "Administration Block",
          coordinates: { lat: 17.0849, lng: 82.0661 },
          mapPosition: { x: 48, y: 32 },
          floors: 3,
          entryPoints: ["Main reception entrance", "Accessible east ramp"],
          prominentOccupantId: principal._id,
          publicFacilities: ["Reception", "Visitor waiting area"],
          departments: ["Administration"],
          roomNumbers: ["101", "102", "201", "301"],
        },
        {
          buildingId: "cse-block",
          name: "CSE Block",
          coordinates: { lat: 17.0838, lng: 82.0647 },
          mapPosition: { x: 34, y: 54 },
          floors: 5,
          entryPoints: ["Ground floor main entrance"],
          prominentOccupantId: hodCSE._id,
          publicFacilities: ["Computer labs", "Seminar hall"],
          departments: ["Computer Science & Engineering"],
          roomNumbers: ["CSE-101", "CSE-205", "CSE-401"],
        },
        {
          buildingId: "ece-block",
          name: "ECE Block",
          coordinates: { lat: 17.0827, lng: 82.0675 },
          mapPosition: { x: 62, y: 58 },
          floors: 4,
          entryPoints: ["North entrance"],
          prominentOccupantId: hodECE._id,
          publicFacilities: ["Electronics labs"],
          departments: ["Electronics & Communication Engineering"],
          roomNumbers: ["ECE-110", "ECE-220", "ECE-315"],
        },
      ],
    });
    console.log("Campus map created...");

    await AdminMessage.create({
      schoolId: school.schoolId,
      fromUserId: hodCSE._id,
      fromRole: hodCSE.role,
      message: "Please review the CSE Block room numbers before the pilot demo.",
    });
    console.log("Admin message created...");

    await AuditLog.create({
      schoolId: school.schoolId,
      userId: admin._id,
      action: "seedDatabase",
      targetType: "system",
      requestStatus: "approved",
      metadata: {
        users: seedUsers.length,
        collections: [
          "schools",
          "users",
          "achievements",
          "notifications",
          "notificationAnalytics",
          "campusMap",
          "adminMessages",
        ],
      },
    });
    console.log("Audit log created...");

    console.log("Database seeded successfully!");
    console.log("");
    console.log("Demo Login Credentials:");
    console.log("Admin:     admin@aditya.edu     / admin123");
    console.log("Principal: principal@aditya.edu / admin123");
    console.log("HOD CSE:   hod.cse@aditya.edu   / admin123");
    console.log("Teacher:   kiran.reddy@aditya.edu / admin123");
    console.log("Student:   arjun.sai@student.aditya.edu / student123");
    console.log("");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDB();
