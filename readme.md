# 🚀 LeetCode Clone - Backend

A robust backend for an online coding platform inspired by **LeetCode**, built using **Node.js**, **Express.js**, **MongoDB**, and **Redis**. The backend provides secure authentication, problem management, code execution, submission tracking, AI integration, and REST APIs for the frontend.

> This repository contains the **Backend** of the application.

---

## 🌐 Frontend Repository

🔗 **Frontend:** (https://github.com/suhanij22/leetcode-clone-frontend.git)

---

# 📖 About the Project

This backend powers an online coding platform where users can:

- Register and securely log in.
- Browse coding problems.
- Submit code in multiple programming languages.
- Receive real-time execution results.
- Track submission history.
- Get AI-powered coding assistance.
- Allow administrators to create and manage coding problems.

The backend follows a modular architecture with separate layers for:

- Authentication
- Problem Management
- Code Execution
- Submission Tracking
- AI Integration
- Database Operations

---

# ✨ Features

## 🔐 Authentication

- User Registration
- Secure Login
- JWT Authentication
- Password Hashing using bcrypt
- Cookie-based Authentication
- Protected Routes
- Role-based Authorization (Admin/User)

---

## 📝 Problem Management

- Create Coding Problems
- Update Existing Problems
- Delete Problems
- Fetch All Problems
- Fetch Individual Problems
- Store:
  - Problem Statement
  - Difficulty
  - Tags
  - Starter Code
  - Visible Test Cases
  - Hidden Test Cases
  - Reference Solutions

---

## ⚡ Code Execution

Integrated with **Judge0 API** to:

- Compile code
- Execute code
- Support multiple programming languages
- Evaluate user submissions
- Validate reference solutions
- Generate execution verdicts

---

## 📊 Submission Management

- Save User Submissions
- Accepted/Wrong Answer Status
- Runtime Information
- Submission History
- Solved Problems Tracking

---

## 🤖 AI Integration

Provides API endpoints for an AI coding assistant that can:

- Explain coding problems
- Answer DSA-related questions
- Explain algorithms
- Help users understand concepts
- Restrict responses to coding-related topics

---

## 🎥 Solution Videos

- Upload Solution Videos
- Associate videos with coding problems
- Store video metadata

---

## ⚡ Redis Caching

Redis is used to:

- Improve API performance
- Cache frequently accessed data
- Reduce database queries

---

# 🛠 Tech Stack

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Redis

## Authentication

- JWT
- bcrypt

## APIs

- Judge0 API
- Gemini API

## File Handling

- Cloudinary
- Multer

---

# 📂 Project Structure

```
src
│
├── config
│   ├── db.js
│   ├── redis.js
│
├── controllers
│   ├── authController.js
│   ├── problemController.js
│   ├── submissionController.js
│   ├── aiController.js
│
├── middleware
│   ├── authMiddleware.js
│   ├── adminMiddleware.js
│
├── models
│   ├── User.js
│   ├── Problem.js
│   ├── Submission.js
│   ├── SolutionVideo.js
│
├── routes
│
├── utils
│
├── app.js
└── index.js
```

---

# 🔐 Authentication Flow

1. User registers.
2. Password is hashed using bcrypt.
3. User logs in.
4. JWT token is generated.
5. Token is sent using cookies.
6. Protected middleware validates requests.
7. Authorized users can access secured endpoints.

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/<your-username>/leetcode-clone-backend.git
```

Move into the project

```bash
cd leetcode-clone-backend
```

Install dependencies

```bash
npm install
```

Run the development server

```bash
npm run dev
```

---

# 🔧 Environment Variables

Create a `.env` file in the root directory.

```env
PORT=

DB_CONNECT_STRING=

JWT_SECRET=

REDIS_URL=

JUDGE0_API_KEY=

GEMINI_API_KEY=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=
```

---

# 📚 REST API Overview

## Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /user/register | Register User |
| POST | /user/login | Login User |
| POST | /user/logout | Logout User |
| GET | /user/check | Check Authentication |

---

## Problems

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /problem/getAllProblem | Get All Problems |
| GET | /problem/:id | Get Single Problem |
| POST | /problem/create | Create Problem |
| PUT | /problem/update/:id | Update Problem |
| DELETE | /problem/delete/:id | Delete Problem |

---

## Submissions

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /submission/create | Submit Code |
| GET | /submission/history | Submission History |

---

## AI

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /ai/chat | AI Coding Assistant |

---

# 🗄 Database Models

### User

- First Name
- Email
- Password
- Role
- Solved Problems

---

### Problem

- Title
- Description
- Difficulty
- Tags
- Starter Code
- Visible Test Cases
- Hidden Test Cases
- Reference Solution

---

### Submission

- User
- Problem
- Code
- Language
- Status
- Runtime
- Memory
- Submitted At

---

# 🚀 Deployment

Backend can be deployed using:

- Render
- Railway
- VPS
- Docker (Future)

---

# 🔒 Security Features

- Password Hashing
- JWT Authentication
- Protected Routes
- Admin Authorization
- Input Validation
- Secure Cookies
- Environment Variables
- API Error Handling

---

# 🚀 Future Improvements

- Contest Support
- Leaderboards
- Discussion Forum
- Code Plagiarism Detection
- Email Verification
- Password Reset
- Docker Support
- Unit Testing
- CI/CD Pipeline
- Rate Limiting

---

# 📚 What I Learned

While building this project, I gained practical experience in:

- REST API Development
- Express.js
- MongoDB & Mongoose
- Authentication using JWT
- Password Hashing
- Redis Caching
- Judge0 API Integration
- AI API Integration
- Cloudinary File Uploads
- Middleware Design
- Backend Architecture
- Error Handling
- Deployment

---

# 🤝 Frontend Repository

This backend powers the React frontend application.

👉 **Frontend Repository:**  
(Add Frontend GitHub Repository Link)

---

# 👩‍💻 Author

**Suhani Jain**

B.Tech Information Technology  
Kamla Nehru Institute of Technology

GitHub: https://github.com/<your-github>

---

## ⭐ If you found this project useful, consider giving it a star!