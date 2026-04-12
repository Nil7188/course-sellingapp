# course-selling-app-Backend
Course Selling Platform-Backend(MERN)

Overview
A backend API for a course selling platform that supports user authentication, course management, and secure purchases.
This project is built to simulate real-world backend workflows including authentication, authorization, and RESTful API design.
Status: 🚧 Work in Progress

Tech Stack
Node.js
Express.js
MongoDB (Mongoose)
JWT Authentication
bcrypt
dotenv
✨ Features (Current & Planned)
✅ Implemented
User Registration & Login
Password hashing using bcrypt
JWT-based authentication
Role-based access (Admin / User)
Course CRUD APIs
Input validation
Proper HTTP status codes
🔄 In Progress
Course purchase flow
Pagination & filtering
Centralized error handling
⏳ Planned
Payment gateway integration
Admin analytics APIs
Unit testing
Authentication Flow
User registers with email and password
Password is securely hashed before storing
User logs in and receives a JWT token
Protected routes verify JWT via middleware
Role-based authorization controls access
