# 🚀 Deployment Guide - OrgTree on Vercel

This guide will walk you through deploying the OrgTree project on Vercel with MongoDB Atlas.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup (MongoDB Atlas)](#database-setup-mongodb-atlas)
3. [Frontend Deployment](#frontend-deployment)
4. [Backend Deployment Options](#backend-deployment-options)
5. [Environment Variables](#environment-variables)
6. [Verification & Testing](#verification--testing)
7. [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

Before deploying, ensure you have:

- ✅ **GitHub Account** - [Create one](https://github.com/signup)
- ✅ **Vercel Account** - [Sign up](https://vercel.com/signup) (free)
- ✅ **MongoDB Atlas Account** - [Create one](https://www.mongodb.com/cloud/atlas/register)
- ✅ **Git** installed locally
- ✅ **Your project code** pushed to GitHub

---

## 🗄️ Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Account

1. Navigate to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up with your email
3. Create a new organization and project

### Step 2: Create a Database Cluster

1. Click **Build a Database**
2. Choose the **Free** tier (M0)
3. Select your preferred region
4. Click **Create Deployment**

### Step 3: Configure Network Access

1. Go to **Network Access** in the left sidebar
2. Click **Add IP Address**
3. Select **Allow Access from Anywhere** (for development)
   - For production, add Vercel's IP addresses
4. Click **Confirm**

### Step 4: Create Database User

1. Go to **Database Access** in the sidebar
2. Click **Add New Database User**
3. Enter username and password
   - **Username**: `orgtree_user`
   - **Password**: Generate a strong password (save this!)
4. Click **Add User**

### Step 5: Get Connection String

1. Click **Databases** in the sidebar
2. Click **Connect** on your cluster
3. Choose **Drivers** (Node.js)
4. Copy the connection string
5. Replace `<password>` with your database user password

**Example URI:**

```
mongodb+srv://orgtree_user:YourPassword@cluster0.xxxxx.mongodb.net/orgtree?retryWrites=true&w=majority
```

Save this connection string - you'll need it for environment variables!

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend for Deployment

Update your `frontend/vite.config.js`:

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://your-backend-url.vercel.app", // Update after backend deployment
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
});
```

### Step 2: Create `.env.production` in Frontend

```env
VITE_API_URL=https://your-backend-url.vercel.app/api
```

### Step 3: Update Frontend API Calls

In your React components, use the environment variable:

```javascript
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
  });
  return response.data;
};
```

### Step 4: Deploy Frontend on Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to frontend directory
cd frontend

# Deploy
vercel
```

#### Option B: Using GitHub (Recommended)

1. Push your code to GitHub:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click **Add New Project**
4. Select your GitHub repository
5. Configure project settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

6. Click **Deploy**

#### Step 5: Add Environment Variables

1. In Vercel Dashboard, go to **Settings** → **Environment Variables**
2. Add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.vercel.app/api`
   - **Environments**: Production, Preview, Development

3. Redeploy to apply changes

---

## 🔧 Backend Deployment Options

### Option 1: Deploy Backend Separately (Recommended)

You can host the backend on:

- **Render.com** (free tier available)
- **Railway.app**
- **Heroku**
- **AWS/Azure**

### Option 2: Deploy as Vercel Serverless Functions

Create `/api` directory structure for Vercel:

#### Step 1: Create Vercel Serverless Functions

```
backend/
├── api/
│   └── auth.js
├── vercel.json
└── ...
```

#### Step 2: Create `vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ],
  "env": {
    "MONGODB_URI": "@mongodb_uri",
    "JWT_SECRET": "@jwt_secret"
  }
}
```

#### Step 3: Update Backend for Serverless

Create a `server.js` that exports a handler:

```javascript
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: ["https://your-frontend-url.vercel.app", "http://localhost:5173"],
  }),
);
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "Ok" });
});

export default app;
```

#### Step 4: Deploy Backend to Vercel

```bash
cd backend
vercel
```

---

## 🔑 Environment Variables

### Frontend Environment Variables

Set these in Vercel Dashboard:

| Variable       | Value           | Example                               |
| -------------- | --------------- | ------------------------------------- |
| `VITE_API_URL` | Backend API URL | `https://your-backend.vercel.app/api` |

### Backend Environment Variables

Set these in Vercel Dashboard:

| Variable      | Value                     | Example                                               |
| ------------- | ------------------------- | ----------------------------------------------------- |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/orgtree` |
| `JWT_SECRET`  | Secret key for JWT        | `your-super-secret-key-here`                          |
| `PORT`        | Server port               | `5000`                                                |
| `NODE_ENV`    | Environment               | `production`                                          |

---

## 🔗 Connect Frontend & Backend

### Step 1: Get Backend URL

After deploying backend to Vercel, you'll get a URL like:

```
https://orgtree-backend.vercel.app
```

### Step 2: Update Frontend

1. Go to Vercel Dashboard
2. Select your frontend project
3. **Settings** → **Environment Variables**
4. Update `VITE_API_URL`:
   ```
   https://orgtree-backend.vercel.app/api
   ```
5. **Redeploy** the project

### Step 3: Update CORS

In backend `server.js`, update CORS origins:

```javascript
app.use(
  cors({
    origin: ["https://your-frontend.vercel.app", "http://localhost:5173"],
    credentials: true,
  }),
);
```

---

## ✅ Verification & Testing

### Test Frontend Deployment

1. Open your Vercel frontend URL
2. Navigate through all pages
3. Verify the landing page loads correctly

### Test Backend Deployment

```bash
# Test health endpoint
curl https://your-backend.vercel.app/health

# Should return:
# {"status": "Ok"}
```

### Test API Connection

```bash
# Test login endpoint
curl -X POST https://your-backend.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Test Full Integration

1. Open frontend in browser
2. Go to Login page
3. Attempt to login
4. Check browser console for API responses
5. Should redirect to Dashboard on success

---

## 🐛 Troubleshooting

### Issue 1: Frontend Can't Connect to Backend

**Solution:**

1. Check Vercel environment variables
2. Verify CORS is configured correctly
3. Check MongoDB connection
4. Look at backend logs in Vercel Dashboard

### Issue 2: MongoDB Connection Error

**Solution:**

```
Error: MongooseError - Authentication failed
```

- Verify MongoDB URI in environment variables
- Check database user password
- Ensure IP whitelist includes Vercel servers

### Issue 3: CORS Error in Browser

**Solution:**

```javascript
// Add to backend
app.use(
  cors({
    origin: "https://your-frontend.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
```

### Issue 4: Build Fails on Vercel

**Solution:**

1. Check build logs in Vercel Dashboard
2. Ensure all dependencies are in `package.json`
3. Verify Node version compatibility
4. Check for missing environment variables

---

## 📊 Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user configured
- [ ] GitHub repository linked to Vercel
- [ ] Frontend environment variables set
- [ ] Backend environment variables set
- [ ] CORS origins configured
- [ ] API URL updated in frontend
- [ ] Frontend deployed successfully
- [ ] Backend deployed successfully
- [ ] Health check endpoint working
- [ ] Login functionality tested
- [ ] Protected routes working
- [ ] Database operations verified
- [ ] SSL/HTTPS enabled

---

## 🔒 Security Tips

1. **Rotate Secrets**: Change JWT_SECRET after deployment
2. **Database**: Use strong passwords, restrict network access in production
3. **CORS**: Only allow your domain in production
4. **HTTPS**: Vercel provides free SSL, always use HTTPS
5. **Env Vars**: Never commit secrets to GitHub
6. **Logs**: Monitor Vercel and MongoDB logs for suspicious activity

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Node.js Support](https://vercel.com/docs/concepts/functions/supported-langs#node.js)
- [MongoDB Atlas Docs](https://docs.mongodb.com/atlas/)
- [Express Deployment](https://expressjs.com/en/advanced/best-practice-performance.html)
- [React Production Build](https://vitejs.dev/guide/build.html)

---

## 🆘 Need Help?

If you encounter issues:

1. **Check Vercel Logs**: Dashboard → Project → Deployments → Logs
2. **Check MongoDB Logs**: Atlas → Project → Logs
3. **GitHub Issues**: Open an issue in your repository
4. **Community**: Ask on [Vercel Community](https://github.com/vercel/community)

---

## 🎉 Success!

After completing these steps, your OrgTree application will be:

- ✅ Deployed on Vercel (Frontend & Backend)
- ✅ Connected to MongoDB Atlas
- ✅ Accessible via HTTPS
- ✅ Auto-scaling on demand
- ✅ Free tier compatible

**Your frontend URL**: `https://your-project.vercel.app`

**Your backend URL**: `https://your-backend.vercel.app`

---

**Last Updated**: April 6, 2026

**Version**: 1.0.0

---

> For more details, visit [Vercel Documentation](https://vercel.com/docs)
