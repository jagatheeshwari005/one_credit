/**
 * Seed an admin user for local development.
 * Usage: node server/seed-admin.js
 * Make sure your MongoDB is running and MONGO_URI is set if needed.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const crypto = require('crypto');

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/event-management';

async function run() {
  try {
    // Safety: never run seeder in production
    if (process.env.NODE_ENV === 'production') {
      console.error('Seeding is disabled in production. Aborting.');
      process.exit(1);
    }

    // Require an explicit opt-in to run the seeder
    if (process.env.SEED_ADMIN_ENABLED !== 'true') {
      console.error('Seeding disabled. Set SEED_ADMIN_ENABLED=true to allow seeding. Aborting.');
      process.exit(1);
    }

    await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB for seeding');

    const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
    // Determine password: prefer env value, otherwise generate a secure random one for local testing
    const password = process.env.SEED_ADMIN_PASSWORD || crypto.randomBytes(12).toString('hex');

    let user = await User.findOne({ email });
    if (user) {
      if (user.role === 'admin') {
        console.log(`Admin user already exists: ${email}`);
      } else {
        user.role = 'admin';
        await user.save();
        console.log(`Updated existing user to admin: ${email}`);
      }
      process.exit(0);
    }

    // Create new admin user
    user = new User({
      name: 'Admin',
      email,
      password,
      role: 'admin',
      isActive: true
    });

    await user.save();
    console.log(`Created new admin user: ${email}`);
    // Print the password only when it was generated or provided for local testing
    console.log('Admin password (store this securely):', password);
    console.warn('NOTE: Do NOT use this seeder or a weak password in production. Remove or protect the seeder before publishing the repository.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

run();
