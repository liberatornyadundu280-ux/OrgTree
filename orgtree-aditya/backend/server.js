const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const User = require("./models/User");
const schools = require("./models/School");
const achievement = require("./models/Achievement");
const notification = require("./models/Notification");
const CampusMap = require("./models/CampusMap");
const adminMessage = require("./models/AdminMessage");
const auditLog = require("./models/AuditLog");

dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "OrgTree Aditya API is running",
    university: "Aditya University, Surampalem",
    version: "1.0.0",
  });
});

/* Running test on every model to check if they are working fine and connected to the database or not.
This is just for testing purpose and will be removed later. 
You can access these routes to see the data in the database for each model.
Make sure to have some data in the database before testing these routes.
 You can use Postman or any other API testing tool to test these routes. The routes are as follows:
 */
// Display all users route
app.get("/test-users", async (req, res) => {
  try {
    const users = await User.find({}).select(
      "name email role password location profilePicture",
    );
    res.json({
      message: "All users from database",
      count: users.length,
      users: users,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
});
// testing admin messages route
app.get("/test-admin-messages", async (req, res) => {
  try {
    const adminMessagesData = await adminMessage.find({});
    res.json({
      message: "All admin messages from database",
      count: adminMessagesData.length,
      adminMessages: adminMessagesData,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching admin messages", error: error.message });
  }
});

// testing audit logs route
app.get("/test-audit-logs", async (req, res) => {
  try {
    const auditLogsData = await auditLog.find({});
    res.json({
      message: "All audit logs from database",
      count: auditLogsData.length,
      auditLogs: auditLogsData,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching audit logs", error: error.message });
  }
});

// testing schools route
app.get("/test-schools", async (req, res) => {
  try {
    const schoolsData = await schools.find({});
    res.json({
      message: "All schools from database",
      count: schoolsData.length,
      schools: schoolsData,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching schools", error: error.message });
  }
});

// testing achievements route
app.get("/test-achievements", async (req, res) => {
  try {
    const achievementsData = await achievement.find({});
    res.json({
      message: "All achievements from database",
      count: achievementsData.length,
      achievements: achievementsData,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching achievements", error: error.message });
  }
});

// testing notifications route
app.get("/test-notifications", async (req, res) => {
  try {
    const notificationsData = await notification.find({});
    res.json({
      message: "All notifications from database",
      count: notificationsData.length,
      notifications: notificationsData,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching notifications", error: error.message });
  }
});

// testing campus maps route
app.get("/test-campus-maps", async (req, res) => {
  try {
    const campusMapsData = await CampusMap.find({});
    res.json({
      message: "All campus maps from database",
      count: campusMapsData.length,
      campusMaps: campusMapsData,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching campus maps", error: error.message });
  }
});
/* end of system test for database connections */

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/schools", require("./routes/schoolRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/achievements", require("./routes/achievementRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/map", require("./routes/mapRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
