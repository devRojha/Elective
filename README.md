# 🎓 Elective.EE – Precision Communication for Coursework at NIT Patna

A smarter way to manage course-specific communication and resources. This platform ensures that only enrolled students receive relevant emails and content — reducing noise and improving academic communication.

---

## 📚 Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Local Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Impact](#impact)

---

## 📖 Introduction

In the Electrical Engineering domain at NIT Patna, students are assigned emails ending with `.ee@nitp.ac.in`. Professors sending course-related notifications often target all `.ee` addresses, leading to irrelevant communication for students not enrolled in that specific course.

**Elective.EE** solves this problem by isolating communication and content-sharing to only those students enrolled in a particular course — making the entire process more efficient for both faculty and students.

---

## ✨ Features

- 🔐 **Authentication** – Sign in/Sign up with NITP Mail, OTP verification, password reset support.
- 🧑‍💼 **Admin Controls** – Upload/manage/delete course-specific files, assign admin roles, and send emails.
- 🎓 **Student Access** – Auto-assigned to enrolled courses with real-time updates.
- ✉️ **Automated Emails** – Course-based bulk email system via SMTP (Azure VM).
- ⚡ **Optimized Backend** – Serverless backend using Cloudflare Workers.
- 🗂 **Resource Sharing** – Course-wise document and content delivery system.

---

## 🛠 Tech Stack

**Frontend**
- Next.js
- TypeScript
- Tailwind CSS

**Main Backend (API)**
- Hono (Cloudflare Workers)
- Prisma ORM
- TypeScript

**SMTP Server**
- Node.js / Express.js
- Nodemailer
- TypeScript

**Infrastructure**
- PostgreSQL (Database)
- Azure Virtual Machine (SMTP Server)
- Vercel (Frontend Hosting)
- Cloudflare Workers (API Hosting)

---

## 🏗️ Architecture Overview

The platform is designed to be modular, fast, and scalable:

       ┌──────────────┐
       │   Frontend   │  ← Next.js on Vercel
       └─────┬────────┘
             │
             ▼
    ┌────────────────────┐
    │ Cloudflare Workers │  ← Hono Backend API
    └────────┬───────────┘
             │
     Prisma + PostgreSQL  ← Database
             │
             ▼
     ┌──────────────┐
     │   SMTP API   │  ← Node.js on AWS EC2
     └──────────────┘


---

## 🧑‍💻 Local Installation & Setup

> ⚠️ Make sure to set up the `.env` file for all applications.

### 🔹 Frontend

```bash
cd frontend
npm install         # Install dependencies
npm run dev         # Runs frontend on http://localhost:3000

cd main-server
npm install         # Install dependencies
npm run dev         # Runs API on http://localhost:3001

cd smtp-server
npm install         # Install dependencies
npm run dev         # Runs SMTP server on http://localhost:5000 (or configured port)

```

---
## 🧭 Usage

### 👨‍🏫 For Professors / Admins
- Log in using your NITP Mail ID or admin credentials.
- Manage courses directly from the dashboard.
- Upload course-specific resources (PDFs, assignments, reference materials).
- Send targeted emails to students enrolled in a particular course.
- Assign or revoke admin access with built-in role management.

### 🎓 For Students
- Sign up using your NITP Mail ID with OTP or password login.
- Automatically view your enrolled courses after login.
- Access all uploaded resources for your registered courses.
- Receive timely and relevant email notifications only for your courses.
- Avoid unnecessary communication from unrelated electives.

---

## 📈 Impact

- 👥 **70+ active users** across Electrical Engineering electives at NIT Patna.
- ✉️ **Zero email noise** — only enrolled students receive course notifications.
- ⏱️ **Significantly reduced faculty effort** in managing communications.
- ⚡ **Real-time updates** and notifications improve student engagement.
- 🧩 **Modular system** ensures scalability for other departments or universities.

