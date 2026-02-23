
# MERN Trello-Style App

A collaborative Trello-inspired board application built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js).  
It supports drag-and-drop notes and lists, real-time collaboration, and automation features — all deployed on **Vercel**.

---

## 🚀 Live Demo & Walkthroughs
- **Main Demo:** [Loom Video](https://www.loom.com/share/5ccd0fb5efbe45c08a3f57c42dc3658f)  
- **WebSocket Functionality:** [Loom Video](https://www.loom.com/share/0f78d20f3f8d419eaf2a074664ac1d45)
- **live url : https://notes-frontend-rouge.vercel.app/**
---

## ✨ Features
- **Drag & Drop Boards**  
  - Move notes and lists interactively
- **Filtering & Sorting**  
  - Organize cards by custom criteria
- **List Management**  
  - Add new lists  
  - Delete lists along with all their cards
- **CRUD Operations**  
  - Fully functional create, read, update, delete for notes and lists
- **Authentication & Authorization**  
  - Secure user access and role-based permissions
- **Image Uploads**  
  - Integrated with **Cloudinary** for storing and displaying images
- **Live Data Sharing**  
  - Real-time board updates using **WebSockets**  
  - Email invitations via **Nodemailer SMTP**
- **Automation**  
  - Rule-based actions for improved workflow
- **Deployment**  
  - Hosted on **Vercel**

---

## 🛠️ Tech Stack
- **Frontend:** React.js, TailwindCSS  
- **Backend:** Node.js, Express.js, MongoDB  
- **Auth:** Custom authentication & authorization  
- **File Storage:** Cloudinary  
- **Collaboration:** WebSockets, Nodemailer SMTP  
- **Deployment:** Vercel  

---

## 📂 Project Setup
1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd trello-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Add environment variables:
   - MongoDB connection string  
   - Cloudinary credentials  
   - SMTP configuration (for Nodemailer)  
   - Auth secrets  

4. Run the app locally:
   ```bash
   npm run dev
   ```

---

## ⚠️ Notes
- WebSockets and Nodemailer SMTP may not function correctly on **Vercel deployment** due to platform limitations.  
- For full real-time collaboration features, run the backend locally or deploy to a service that supports persistent WebSocket connections.

---

## 📽️ Demo
Check out the Loom videos for a complete walkthrough of the app’s features and WebSocket functionality:
- [Main Demo](https://www.loom.com/share/5ccd0fb5efbe45c08a3f57c42dc3658f)  
- [WebSocket Demo](https://www.loom.com/share/0f78d20f3f8d419eaf2a074664ac1d45)
 - **live url : https://notes-frontend-rouge.vercel.app/**

