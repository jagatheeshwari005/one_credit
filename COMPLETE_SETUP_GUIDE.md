# 🎯 Complete Event Management Setup & Testing Guide

## 🚀 Quick Start (Step-by-Step)

### 1. Environment Setup
```bash
# Copy environment template
copy .env.example .env

# Edit .env file with these values:
MONGO_URI=mongodb://localhost:27017/event-management
JWT_SECRET=your_super_secret_jwt_key_change_this
PORT=5000
CLIENT_URL=http://localhost:3000
```

### 2. Install Dependencies & Start Application
```bash
# Install all dependencies
npm install

# Start both frontend and backend
npm run dev
```

### 3. Seed Database with Sample Data
```bash
# Create admin user
node create-admin.js

# Add sample events
node server/seed-events.js
```

## 🎪 Complete User Flow Testing

### Registration → Login → Event Creation Flow

1. **Open Application**: http://localhost:3000

2. **Register New User**:
   - Click "Sign Up" 
   - Fill: Name, Email, Password
   - Submit registration

3. **After Login, You'll See**:
   - ✅ "Create Event" link in navbar
   - ✅ "Cart" icon with badge
   - ✅ "Admin" link (if admin user)

4. **Create Your First Event**:
   - Click "Create Event"
   - Fill all required fields:
     - Title: "My Awesome Event"
     - Description: "This is a test event"
     - Date: Select future date/time
     - Location: "Test Location"
     - Price: 25.00
     - Category: Select any
     - Max Attendees: 100
   - Click "Create Event"

5. **View Events**:
   - Navigate to "Events" page
   - See your created event + sample events
   - Use search and filter functionality

6. **Add Events to Cart**:
   - Click "Add to Cart" on any event
   - See cart badge update
   - Visit cart page to manage items

## 🔧 Available Features After Login

### For Regular Users:
- ✅ Create events
- ✅ View all events
- ✅ Search and filter events
- ✅ Add events to cart
- ✅ Manage cart items

### For Admin Users:
- ✅ All user features +
- ✅ Admin dashboard
- ✅ User management
- ✅ Role assignment
- ✅ User status control

## 📊 Sample Events Included

After running `node server/seed-events.js`, you'll have:

1. **Tech Conference 2024** - $299.99 (Conference)
2. **React Workshop** - $149.99 (Workshop)
3. **Summer Music Festival** - $89.99 (Concert)
4. **Basketball Championship** - $45.00 (Sports)
5. **Art Gallery Opening** - $25.00 (Exhibition)
6. **Startup Pitch Night** - $35.00 (Conference)
7. **Cooking Masterclass** - $125.00 (Workshop)
8. **Jazz Night** - $55.00 (Concert)

## 🎯 Testing Checklist

### ✅ Authentication Flow
- [ ] User registration works
- [ ] User login works
- [ ] Protected routes redirect to login
- [ ] Logout functionality works

### ✅ Event Management
- [ ] Create event form validates properly
- [ ] Events display on events page
- [ ] Search functionality works
- [ ] Category filtering works
- [ ] Event images display correctly

### ✅ Cart Functionality
- [ ] Add to cart works
- [ ] Cart badge updates
- [ ] Cart page shows items
- [ ] Remove from cart works

### ✅ Admin Features (if admin)
- [ ] Admin dashboard accessible
- [ ] User management works
- [ ] Role changes work
- [ ] User status toggle works

## 🚨 Troubleshooting

### Common Issues & Solutions

**1. MongoDB Connection Error**
```bash
# Make sure MongoDB is running
# Windows: Start MongoDB service
# Check connection string in .env
```

**2. Port Already in Use**
```bash
# Kill processes on ports 3000 and 5000
netstat -ano | findstr :3000
netstat -ano | findstr :5000
# Kill using task manager or:
taskkill /PID <PID_NUMBER> /F
```

**3. Events Not Displaying**
```bash
# Re-run seed script
node server/seed-events.js
```

**4. Create Event Not Working**
- Check if user is logged in
- Verify JWT token in localStorage
- Check browser console for errors

**5. Admin Dashboard Not Accessible**
```bash
# Create admin user
node create-admin.js
# Login with: admin@eventmanagement.com / admin123
```

## 🔗 Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Events Page**: http://localhost:3000/events
- **Create Event**: http://localhost:3000/create-event
- **Admin Dashboard**: http://localhost:3000/admin
- **Cart**: http://localhost:3000/cart

## 📱 API Endpoints

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (auth required)
- `GET /api/events/:id` - Get single event

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add to cart
- `PUT /api/cart/update/:id` - Update cart item
- `DELETE /api/cart/remove/:id` - Remove from cart

## 🎉 Success Indicators

Your setup is complete when you can:
1. ✅ Register and login successfully
2. ✅ See "Create Event" in navbar after login
3. ✅ Create a new event successfully
4. ✅ View events on the events page
5. ✅ Add events to cart and see badge update
6. ✅ Access admin dashboard (if admin user)

**🎊 Congratulations! Your event management system is fully functional!**
