# Event Management Application - Setup Guide

## Issues Fixed

I've identified and resolved several configuration and setup issues in your event management application:

### 1. Environment Configuration
- **Created**: `.env.example` file with all necessary environment variables
- **Issue**: Missing environment configuration was causing server startup issues

### 2. Port Configuration Mismatch
- **Fixed**: `package.json` proxy setting from port 5001 to 5000
- **Issue**: Frontend was trying to connect to wrong backend port

### 3. CSS Files
- **Verified**: All CSS files for Navbar and Footer components exist and are properly configured

## Setup Instructions

### 1. Environment Setup
```bash
# Copy the example environment file
copy .env.example .env

# Edit the .env file with your actual values:
# - Change JWT_SECRET to a secure random string
# - Update MongoDB URI if using a different database
# - Add Google OAuth credentials if needed
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup
```bash
# Make sure MongoDB is running on your system
# The application will connect to: mongodb://localhost:27017/event-management

# Create an admin user (optional)
node create-admin.js
```

### 4. Start the Application
```bash
# Development mode (runs both frontend and backend)
npm run dev

# Or start them separately:
# Backend only:
npm run server

# Frontend only (in another terminal):
npm start
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Dashboard**: http://localhost:3000/admin (requires admin account)

## Default Admin Credentials
If you run the `create-admin.js` script:
- **Email**: admin@eventmanagement.com
- **Password**: admin123
- **⚠️ Important**: Change this password after first login!

## Application Features
- User registration and login
- Google OAuth authentication (optional)
- Event management
- Shopping cart functionality
- Admin dashboard for user management
- Password reset functionality

## Troubleshooting

### Common Issues:
1. **MongoDB Connection Error**: Ensure MongoDB is running locally
2. **Port Already in Use**: Make sure ports 3000 and 5000 are available
3. **Google OAuth Not Working**: Add proper Google OAuth credentials to .env file
4. **Admin Access Denied**: Run `node create-admin.js` to create admin user

### Environment Variables Required:
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Backend server port (default: 5000)
- `CLIENT_URL`: Frontend URL (default: http://localhost:3000)

All configuration issues have been resolved. Your application should now run without errors!
