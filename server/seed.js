const mongoose = require('mongoose');
const Event = require('./models/Event');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const sampleEvents = [
  {
    title: 'Tech Conference 2023',
    description: 'Annual technology conference featuring the latest in web development and AI.',
    date: new Date('2023-11-15T09:00:00'),
    location: 'San Francisco, CA',
    createdBy: 'admin'
  },
  {
    title: 'React Workshop',
    description: 'Hands-on workshop to learn React.js from scratch.',
    date: new Date('2023-10-20T13:30:00'),
    location: 'Online',
    createdBy: 'admin'
  },
  {
    title: 'Node.js Meetup',
    description: 'Monthly meetup for Node.js developers to share knowledge and network.',
    date: new Date('2023-11-05T18:00:00'),
    location: 'New York, NY',
    createdBy: 'admin'
  },
  {
    title: 'Web Design Masterclass',
    description: 'Learn modern web design principles and tools.',
    date: new Date('2023-12-10T10:00:00'),
    location: 'Chicago, IL',
    createdBy: 'admin'
  },
  {
    title: 'DevOps Conference',
    description: 'Learn about the latest trends in DevOps and cloud technologies.',
    date: new Date('2024-01-15T09:00:00'),
    location: 'Seattle, WA',
    createdBy: 'admin'
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/event-management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await Event.deleteMany({});
    console.log('Cleared existing events');

    // Create a test user if not exists
    let user = await User.findOne({ email: 'test@example.com' });
    
    if (!user) {
      user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
      
      // Hash password is handled by the pre-save hook in the User model
      await user.save();
      console.log('Created test user');
    }

    // Add createdBy reference to sample events
    const eventsWithUser = sampleEvents.map(event => ({
      ...event,
      createdBy: user._id
    }));

    // Insert sample events
    await Event.insertMany(eventsWithUser);
    console.log('Added sample events');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
