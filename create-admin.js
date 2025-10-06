// Script to create an admin user or promote existing user to admin
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./server/models/User');

// Load environment variables
dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/event-management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('✅ Admin user already exists:', existingAdmin.email);
      process.exit(0);
    }

    // Check if any users exist
    const userCount = await User.countDocuments();
    
    if (userCount === 0) {
      // Create first admin user
      console.log('Creating first admin user...');
      
      const adminData = {
        name: 'Admin User',
        email: 'admin@eventmanagement.com',
        password: 'admin123', // Change this password!
        role: 'admin',
        lastLogin: new Date()
      };

      const admin = new User(adminData);
      await admin.save();
      
      console.log('✅ First admin user created successfully!');
      console.log('📧 Email: admin@eventmanagement.com');
      console.log('🔑 Password: admin123');
      console.log('⚠️  IMPORTANT: Please change the password after first login!');
    } else {
      // Promote first user to admin
      const firstUser = await User.findOne().sort({ createdAt: 1 });
      
      if (firstUser) {
        firstUser.role = 'admin';
        await firstUser.save();
        
        console.log('✅ First user promoted to admin successfully!');
        console.log('📧 Admin Email:', firstUser.email);
        console.log('👤 Admin Name:', firstUser.name);
      }
    }

  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
createAdmin();
