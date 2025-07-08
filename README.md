# 📸 Social Media Platform

A full-stack social media application that allows users to register, create and view posts, interact with others, and manage their profile. This app mimics a modern Instagram-like experience with clean UI and robust backend features.

---

*IMPORTANT*
Since Backend is deployed through render using free tier it turns off after 15 mins of inactivity causing server error while accessing the deployed website

Backend link : https://social-media-ethnus.onrender.com
Frontend and complete website : https://social-media-ethnus-git-main-ishaan-mishras-projects-2feb93c2.vercel.app/

## 🌟 Features

### 🧑 User Functionality
- Register/Login with secure credentials
- Upload profile picture via Cloudinary
- View your own profile and others' profiles
- Follow/Unfollow users
- Edit your profile (bio, username, picture, etc.)
- Delete your own profile

### 🖼️ Post Management
- Create a post with image (via Cloudinary) and caption
- View your own posts in a profile gallery
- View latest posts in a scrollable feed
- Like and Unlike posts (toggle system)
- Comment on posts
- Delete your own post

### 🔍 Discover
- Search users by `userid` or `username`
- Visit other users' profiles from search results

---

## 🚀 Unique Selling Points (USP)
- 🔁 **Live Like/Unlike Toggling** with backend-validated sync
- ☁️ **Image Upload to Cloudinary** to avoid large payloads and scale easily
- 🧠 **Smart CORS Handling** to enable safe cross-origin frontend-backend integration
- 🔒 **Password Security** with bcrypt
- 💬 **Dynamic Comment System** with real-time updates
- 🧾 **MongoDB Cloud Integration** for collaborative and scalable database access

---

## 📊 Key Performance Indicators (KPIs)
- ⚡ Fast page load with image previews and transitions
- ⏱️ Optimized API performance (~200ms typical response time)
- 🧵 Minimal payload size due to CDN (Cloudinary) usage
- 👥 Scalable up to 100s of users concurrently
- 📈 Smooth UX on both mobile and desktop

---

## 🔧 Tech Stack

| Layer          | Technology                          |
|----------------|--------------------------------------|
| **Frontend**   | React.js, Vite, CSS Modules          |
| **Backend**    | Node.js, Express.js                  |
| **Database**   | MongoDB Atlas (Cloud MongoDB)        |
| **Image Hosting** | Cloudinary                        |
| **Authentication** | bcrypt, JWT (future-ready)       |
| **Hosting (Frontend)** | Vercel                      |
| **Hosting (Backend)**  | Render                      |

---


## 🔐 Environment Variables
MONGO_URI=mongodb+srv://mishraishaan31:Mahi%40918117@cluster0.r1s1v.mongodb.net/socialmedia?retryWrites=true&w=majority&appName=Cluster0


backend through index.js


Deployment
Backend: Render
Push backend to GitHub

Connect to Render → New Web Service

Set:

Root Directory: backend

Build Command: npm install

Start Command: node index.js

Frontend: Vercel
Push frontend to GitHub

Connect to Vercel → New Project

Set:

Framework: React/Vite

Root Directory: frontend

Add environment variable VITE_BACKEND_URL