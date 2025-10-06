# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for your event management application.

## Prerequisites

1. A Google Cloud Platform (GCP) account
2. Your application running on `http://localhost:3000` (frontend) and `http://localhost:5000` (backend)

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (or Google People API)

## Step 2: Configure OAuth Consent Screen

1. In the Google Cloud Console, go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type (unless you have a Google Workspace account)
3. Fill in the required information:
   - App name: "Event Management App"
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes: `../auth/userinfo.email` and `../auth/userinfo.profile`
5. Add test users (your email addresses for testing)

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Configure the settings:
   - **Name**: Event Management OAuth Client
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**: `http://localhost:5000/api/auth/google/callback`

## Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env`
2. Update the Google OAuth variables:
   ```
   GOOGLE_CLIENT_ID=your_actual_client_id_from_step_3
   GOOGLE_CLIENT_SECRET=your_actual_client_secret_from_step_3
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
   ```

## Step 5: Install Dependencies and Start the Application

1. Install the new dependencies:
   ```bash
   npm install
   ```

2. Start both frontend and backend:
   ```bash
   npm run dev
   ```

## How It Works

1. User clicks "Sign in with Google" on the login or register page
2. User is redirected to Google's OAuth consent screen
3. After approval, Google redirects to `/api/auth/google/callback`
4. Backend creates or finds the user account and generates a JWT token
5. User is redirected to `/auth/success` with the token
6. Frontend stores the token and redirects to the dashboard

## Troubleshooting

- **Error 400: redirect_uri_mismatch**: Make sure your redirect URI in Google Console exactly matches `http://localhost:5000/api/auth/google/callback`
- **Error 403: access_blocked**: Add your email as a test user in the OAuth consent screen
- **Token not received**: Check browser console for errors and ensure all environment variables are set correctly

## Security Notes

- Never commit your `.env` file to version control
- Use different OAuth credentials for production
- Consider implementing additional security measures like CSRF protection for production use
