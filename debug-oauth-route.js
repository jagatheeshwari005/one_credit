// Debug script to test Google OAuth route
const express = require('express');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Test route to check if OAuth endpoint works
app.get('/api/auth/google', (req, res) => {
  console.log('Google OAuth route accessed!');
  
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(500).json({ 
      error: 'Google OAuth not configured',
      message: 'Missing GOOGLE_CLIENT_ID in .env file'
    });
  }
  
  res.json({ 
    message: 'Google OAuth route working',
    clientId: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Missing',
    redirectUrl: `https://accounts.google.com/oauth/authorize?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback')}&scope=profile%20email&response_type=code`
  });
});

const PORT = 5001; // Different port to avoid conflicts
app.listen(PORT, () => {
  console.log(`Debug server running on http://localhost:${PORT}`);
  console.log(`Test OAuth route: http://localhost:${PORT}/api/auth/google`);
});
