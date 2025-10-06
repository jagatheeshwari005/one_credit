const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('./models/Event');
const User = require('./models/User');

// Load environment variables
dotenv.config();

const sampleEvents = [
  {
    title: "Tech Conference 2024",
    description: "Join industry leaders for the biggest tech conference of the year. Learn about AI, blockchain, and the future of technology.",
    date: new Date('2024-03-15T09:00:00Z'),
    location: "San Francisco Convention Center",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
    category: "conference",
    maxAttendees: 500,
    currentAttendees: 0
  },
  {
    title: "React Workshop",
    description: "Hands-on workshop covering React hooks, context, and advanced patterns. Perfect for intermediate developers.",
    date: new Date('2024-02-20T10:00:00Z'),
    location: "Tech Hub Downtown",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop",
    category: "workshop",
    maxAttendees: 30,
    currentAttendees: 0
  },
  {
    title: "Summer Music Festival",
    description: "Three days of amazing music featuring top artists from around the world. Food trucks, art installations, and more!",
    date: new Date('2024-07-12T18:00:00Z'),
    location: "Central Park",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    category: "concert",
    maxAttendees: 10000,
    currentAttendees: 0
  },
  {
    title: "Basketball Championship",
    description: "Watch the city's best teams compete for the championship title. Exciting games and great atmosphere!",
    date: new Date('2024-04-05T19:00:00Z'),
    location: "Sports Arena",
    price: 45.00,
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop",
    category: "sports",
    maxAttendees: 15000,
    currentAttendees: 0
  },
  {
    title: "Art Gallery Opening",
    description: "Exclusive opening of contemporary art exhibition featuring local and international artists.",
    date: new Date('2024-03-08T17:00:00Z'),
    location: "Modern Art Museum",
    price: 25.00,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    category: "exhibition",
    maxAttendees: 200,
    currentAttendees: 0
  },
  {
    title: "Startup Pitch Night",
    description: "Watch innovative startups pitch their ideas to investors. Network with entrepreneurs and industry experts.",
    date: new Date('2024-02-28T18:30:00Z'),
    location: "Innovation Center",
    price: 35.00,
    image: "https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=400&h=300&fit=crop",
    category: "conference",
    maxAttendees: 150,
    currentAttendees: 0
  },
  {
    title: "Cooking Masterclass",
    description: "Learn from professional chefs in this hands-on cooking experience. All ingredients and equipment provided.",
    date: new Date('2024-03-22T14:00:00Z'),
    location: "Culinary Institute",
    price: 125.00,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    category: "workshop",
    maxAttendees: 20,
    currentAttendees: 0
  },
  {
    title: "Jazz Night",
    description: "Intimate evening of smooth jazz featuring renowned musicians. Wine and cocktails available.",
    date: new Date('2024-02-14T20:00:00Z'),
    location: "Blue Note Club",
    price: 55.00,
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    category: "concert",
    maxAttendees: 100,
    currentAttendees: 0
  }
];

const seedEvents = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/event-management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Find an admin user to assign as event creator
    let adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      // Create a default admin if none exists
      console.log('No admin user found, creating default admin...');
      adminUser = new User({
        name: 'Event Admin',
        email: 'admin@eventmanagement.com',
        password: 'admin123',
        role: 'admin',
        lastLogin: new Date()
      });
      await adminUser.save();
      console.log('Default admin created');
    }

    // Clear existing events
    await Event.deleteMany({});
    console.log('Cleared existing events');

    // Add createdBy field to each event
    const eventsWithCreator = sampleEvents.map(event => ({
      ...event,
      createdBy: adminUser._id
    }));

    // Insert sample events
    await Event.insertMany(eventsWithCreator);
    console.log(`✅ Successfully seeded ${sampleEvents.length} events`);

    // Display created events
    const events = await Event.find().populate('createdBy', 'name email');
    console.log('\n📅 Created Events:');
    events.forEach(event => {
      console.log(`- ${event.title} (${event.category}) - $${event.price}`);
    });

  } catch (error) {
    console.error('❌ Error seeding events:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
seedEvents();
