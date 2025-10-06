// Quick test script to check if Google OAuth dependencies are available
console.log('Testing Google OAuth setup...\n');

try {
  // Test if passport is available
  const passport = require('passport');
  console.log('✅ passport: Available');
  
  // Test if passport-google-oauth20 is available
  const GoogleStrategy = require('passport-google-oauth20').Strategy;
  console.log('✅ passport-google-oauth20: Available');
  
  // Test if express-session is available
  const session = require('express-session');
  console.log('✅ express-session: Available');
  
  console.log('\n📋 Dependencies Status: ALL GOOD');
  
} catch (error) {
  console.log('❌ Missing dependency:', error.message);
  console.log('\n🔧 Run: npm install');
}

// Test environment variables
require('dotenv').config();

console.log('\n🔍 Environment Variables:');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ Missing');
console.log('GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL || 'Using default');

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.log('\n⚠️  Google OAuth will NOT work without these credentials');
  console.log('📝 Create .env file with your Google Cloud Console credentials');
}
