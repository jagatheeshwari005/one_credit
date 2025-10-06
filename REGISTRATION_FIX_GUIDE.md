# Registration Fix Guide

## 🔧 Fix Registration Issues

### Step 1: Check Server Status
```bash
# Test if server is running
node test-registration.js
```

### Step 2: Start Required Services
```bash
# Terminal 1: Start MongoDB
npm run start-mongodb

# Terminal 2: Start Backend Server
npm run server

# Terminal 3: Start Frontend
npm start
```

### Step 3: Common Registration Issues & Solutions

#### Issue 1: "Network Error" or "Cannot connect to server"
**Solution:**
- Make sure backend is running on port 5000
- Check if MongoDB is running
- Verify no firewall blocking the connection

#### Issue 2: "User already exists"
**Solution:**
- This is normal if you've registered before
- Try with a different email address
- Or clear the database: `npm run seed` (this will reset everything)

#### Issue 3: "Password must be at least 6 characters"
**Solution:**
- Use a password with 6+ characters
- Include letters and numbers for better security

#### Issue 4: "Server error during registration"
**Solution:**
- Check MongoDB connection
- Restart the server
- Check server logs for detailed error messages

### Step 4: Test Registration Flow
1. Go to `http://localhost:3000/register`
2. Fill in the form:
   - Name: Your Full Name
   - Email: your-email@example.com
   - Password: password123 (6+ characters)
3. Click "Create Account"
4. Should redirect to `/events` page

### Step 5: Create Professional Events
```bash
# Run this to create 6 professional events
node seed-professional-events.js
```

## 🎯 Professional Events Created

1. **Tech Innovation Summit 2024** - $299
   - 500 attendees, San Francisco
   - AI, Innovation, Networking

2. **Digital Marketing Masterclass** - $199
   - 150 attendees, New York
   - SEO, Social Media, Analytics

3. **Sustainable Business Conference** - $249
   - 300 attendees, Seattle
   - Sustainability, Environment, ESG

4. **Leadership Excellence Workshop** - $399
   - 50 attendees, Chicago
   - Leadership, Management, Soft Skills

5. **FinTech Innovation Forum** - $349
   - 200 attendees, Boston
   - Blockchain, Cryptocurrency, Digital Banking

6. **Healthcare Technology Summit** - $279
   - 250 attendees, Austin
   - Telemedicine, AI Healthcare, Medical Devices

## 🚀 Quick Start Commands

```bash
# 1. Start MongoDB
npm run start-mongodb

# 2. Start Backend (in new terminal)
npm run server

# 3. Start Frontend (in new terminal)
npm start

# 4. Create Professional Events (in new terminal)
node seed-professional-events.js

# 5. Test Registration
node test-registration.js
```

## 🔍 Debugging Tips

### Check Server Logs
Look for these messages in your server terminal:
- ✅ "MongoDB connected"
- ✅ "Server running on port 5000"
- ✅ "Registration request received"
- ✅ "User saved successfully"

### Check Browser Console
Open browser DevTools (F12) and look for:
- Network requests to `localhost:5000`
- Any JavaScript errors
- Console logs from registration

### Common Error Messages
- **"Network Error"**: Server not running or wrong port
- **"User already exists"**: Try different email
- **"Password too short"**: Use 6+ character password
- **"Server error"**: Check MongoDB connection

## 📱 Testing the Complete Flow

1. **Registration**: Create account successfully
2. **Login**: Login with your credentials
3. **Browse Events**: View the 6 professional events
4. **Book Event**: Select an event and complete booking
5. **Admin Dashboard**: Check bookings (if you're admin)

## 🎉 Success Indicators

- ✅ Registration redirects to `/events`
- ✅ 6 professional events are visible
- ✅ Can book events successfully
- ✅ Admin dashboard shows bookings
- ✅ Email notifications work (if configured)

## 🆘 Still Having Issues?

1. **Restart everything**:
   ```bash
   # Stop all processes (Ctrl+C)
   # Then restart in order:
   npm run start-mongodb
   npm run server
   npm start
   ```

2. **Check ports**:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000
   - MongoDB: mongodb://localhost:27017

3. **Clear browser cache** and try again

4. **Check firewall/antivirus** settings

Your registration system should now work perfectly! 🎉

