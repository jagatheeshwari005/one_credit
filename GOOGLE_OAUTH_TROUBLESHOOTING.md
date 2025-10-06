# Google OAuth Troubleshooting Guide

## Current Issue: "Continue with Google" button doesn't ask for user email

### Root Cause
The Google OAuth isn't working because of missing setup steps.

## Step-by-Step Fix

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File
Create a `.env` file in the root directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/event-management

# Frontend URL
CLIENT_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Google OAuth - REQUIRED
GOOGLE_CLIENT_ID=your_google_client_id_from_console
GOOGLE_CLIENT_SECRET=your_google_client_secret_from_console
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

### 3. Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable Google+ API or People API
4. Go to "APIs & Services" > "Credentials"
5. Click "Create Credentials" > "OAuth 2.0 Client ID"
6. Choose "Web application"
7. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
8. Copy Client ID and Client Secret to your `.env` file

### 4. Test Dependencies
Run this to check if everything is installed:
```bash
node test-oauth.js
```

### 5. Start Application
```bash
npm run dev
```

## Quick Debug Steps

### Test OAuth Route Directly
1. Start your server
2. Go to: `http://localhost:5000/api/auth/google`
3. Should redirect to Google OAuth consent screen

### Check Server Logs
Look for these errors:
- "Cannot find module 'passport'" → Run `npm install`
- "GoogleStrategy requires a clientID" → Missing GOOGLE_CLIENT_ID in .env
- "redirect_uri_mismatch" → Wrong callback URL in Google Console

### Common Issues

**Button clicks but nothing happens:**
- Dependencies not installed
- Server not running
- Missing .env file

**Error 400: redirect_uri_mismatch:**
- Callback URL in Google Console must be exactly: `http://localhost:5000/api/auth/google/callback`

**Error 403: access_blocked:**
- Add your email as test user in OAuth consent screen
- App not verified (use test mode)

## Expected Flow
1. Click "Continue with Google" → Redirects to `http://localhost:5000/api/auth/google`
2. Server redirects to Google OAuth consent screen
3. User approves → Google redirects to callback
4. Server creates JWT token → Redirects to `/auth/success?token=...`
5. Frontend stores token and redirects to dashboard
