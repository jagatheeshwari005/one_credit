# 🔧 Fix Events Display Issue

## Problem
The Events page shows "Failed to fetch events" because the database is empty.

## Solution
You need to populate the database with sample events.

## Step-by-Step Fix

### 1. First, make sure your server is running
```bash
npm run dev
```

### 2. In a new terminal, seed the database with events
```bash
npm run seed-events
```

### 3. Alternative: Run the seed script directly
```bash
node server/seed-events.js
```

### 4. Expected Output
You should see:
```
Connected to MongoDB
Found 0 events
✅ Successfully seeded 8 events

📅 Created Events:
- Tech Conference 2024 (conference) - $299.99
- React Workshop (workshop) - $149.99
- Summer Music Festival (concert) - $89.99
- Basketball Championship (sports) - $45
- Art Gallery Opening (exhibition) - $25
- Startup Pitch Night (conference) - $35
- Cooking Masterclass (workshop) - $125
- Jazz Night (concert) - $55
```

### 5. Refresh the Events page
After seeding, go to: http://localhost:3000/events

## What You'll See After Fix
- 8 beautiful event cards with images
- Search and filter functionality
- "Add to Cart" buttons on each event
- Professional layout with categories

## If Still Not Working
1. Check browser console for errors (F12)
2. Check server terminal for error messages
3. Verify MongoDB is running
4. Make sure .env file exists with correct MONGO_URI

## Quick Test
After seeding, you should see event cards like:
- Tech Conference 2024 - March 15, 2024
- React Workshop - February 20, 2024
- Summer Music Festival - July 12, 2024
- And 5 more events...
