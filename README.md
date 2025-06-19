# Space – A Social Media RESTful API

**Space** is a full-featured backend RESTful API for a social media platform, built with **Node.js**, **Express.js**, and **MongoDB**.

It includes user authentication, posts, likes, comments, follow/unfollow functionality, password recovery, and in-database notifications. The project is structured using controllers, services, validators, and includes full Swagger documentation.

---

## Features

### Authentication & Authorization
- User registration with profile image upload
- Secure login using JWT
- Role-based access control (User / Admin)
- Protected routes using middleware

### User System
- Get all users
- View user profile
- Follow / Unfollow users
- Delete user accounts
- Followers and following counts

### Posts
- Create, update, delete posts (with optional image)
- Get all posts, a single post, or posts by user
- Like / Unlike posts

### Comments
- Add comments to posts
- Delete comments (owner or admin)
- Fetch post comments

### Notifications
- Automatically create notifications for likes and follows
- Notifications stored in database (no real-time push)

### Password Recovery
- Send password reset email with secure token
- Token expires after 1 hour
- Reset password using token

### Validation & Security
- Express-validator for input validation
- Rate limiting to prevent abuse
- File upload validation (image only)

---

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT + bcrypt
- Multer (file uploads)
- Nodemailer (Gmail SMTP)
- Swagger (YAML-based docs)

---

## Project Structure

space-app/

├── controllers/ # Route handlers (auth, posts, users, etc.)

├── services/ # Business logic separated from controllers

├── routes/ # Express route definitions grouped by feature

├── models/ # Mongoose schemas and models

├── middlewares/ # Authentication, file uploads, validation, etc.

├── validators/ # Request validation using express-validator

├── docs/ # Swagger YAML files for API documentation

├── utils/ # Utility functions (JWT generation, email sender, etc.)

├── uploads/ # Uploaded profile images (served statically)

├── app.js # Express application setup

└── server.js # Server initialization and startup
