# user-auth-api

User authentication project implementation using Node.js, MongoDB and Express.js task by Innobyte Solution

# User Authentication API

This project implements a user authentication system using **Node.js**, **MongoDB**, and **Express.js**. It provides a basic authentication flow for user registration, login, profile management, and email verification.

### Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Testing](#testing)

---

## Project Overview

This is a user authentication API built using **Node.js**, **Express.js**, and **MongoDB**. It supports the following features:

- **User Sign Up**: Allows new users to register with basic details like name, email, username, and password.
- **User Login**: Allows users to authenticate using their username/email and password.
- **JWT Authentication**: After logging in, a JSON Web Token (JWT) is issued for session management.
- **Profile Management**: Users can access their profile data after logging in.
- **Email Verification**: A verification email is sent after registration to confirm the user's email address.
- **Sign Out**: Users can sign out, invalidating the JWT.

---

## Features

- Secure password hashing with **bcrypt**.
- Authentication via **JWT** (JSON Web Tokens).
- Email verification and activation via **Nodemailer**.
- Role-based authentication and user management.
- API rate limiting and input validation using **express-validator**.

---

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **Email Service**: Nodemailer
- **Password Hashing**: bcrypt
- **Environment Configuration**: dotenv
- **Error Handling**: Custom Error Handler

---

## Getting Started

Follow these steps to get your development environment set up for this project.

### Prerequisites

Before you begin, ensure that you have the following software installed on your local machine:

- **Node.js** and **npm** (Node Package Manager) - [Install Node.js](https://nodejs.org/)
- **MongoDB** - [Install MongoDB](https://www.mongodb.com/try/download/community)
- **Postman** or **cURL** for testing API endpoints (optional).

### Installation

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/your-username/user-auth-api.git
   cd user-auth-api
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root of the project and add the following environment variables:

   ```bash
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/user-auth
   SECRET_KEY=your-secret-key
   CORS_ORIGIN=http://localhost:3000
   MAIL_HOST=smtp.mailtrap.io
   MAIL_PORT=587
   MAIL_USER=your-mailtrap-username
   MAIL_PASS=your-mailtrap-password
   ```

   - `MONGO_URI`: MongoDB connection string.
   - `SECRET_KEY`: JWT secret key for signing tokens.
   - `CORS_ORIGIN`: The origin URL for CORS requests.
   - `MAIL_*`: Credentials for sending verification emails (use services like Mailtrap for testing).

### Configuration

- **MongoDB**: Ensure that your MongoDB instance is running. You can either use a local instance or a cloud-based MongoDB service like **MongoDB Atlas**.
- **Mail Service**: Configure your email service provider. For local development, you can use services like **Mailtrap** for testing email sending.

### Running the Project

After installation and configuration, you can start the project by running the following command:

```bash
npm start
```
