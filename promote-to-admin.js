// Script to promote a user to admin or create an admin user
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./server/models/User');

dotenv.config();

const args = process.argv.slice(2);
// Usage: node promote-to-admin.js --email you@example.com --password yourpass
const getArg = (name) => {
  const idx = args.indexOf(`--${name}`);
  if (idx === -1) return null;
  return args[idx + 1];
};

const email = getArg('email');
const password = getArg('password') || 'admin123';

if (!email) {
  console.error('Usage: node promote-to-admin.js --email you@example.com [--password yourpass]');
  process.exit(1);
}

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/event-management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    let user = await User.findOne({ email: email.toLowerCase().trim() });

    if (user) {
      user.role = 'admin';
      await user.save();
      console.log(`✅ Promoted existing user to admin: ${user.email}`);
    } else {
      // create user
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);

      user = new User({
        name: email.split('@')[0],
        email: email.toLowerCase().trim(),
        password: hashed,
        role: 'admin',
        lastLogin: new Date()
      });

      await user.save();
      console.log(`✅ Created new admin user: ${user.email} with provided password`);
    }

    console.log('Please login via the app and change the password if needed.');
  } catch (err) {
    console.error('Error:', err.message || err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

run();
