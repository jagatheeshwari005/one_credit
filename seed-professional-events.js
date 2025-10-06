const mongoose = require('mongoose');
const Event = require('./server/models/Event');
require('dotenv').config();

const professionalEvents = [
  {
    title: "Tech Innovation Summit 2024",
    description: "Join industry leaders and innovators for a comprehensive exploration of cutting-edge technologies, AI advancements, and digital transformation strategies. This premier event features keynote speakers from top tech companies, hands-on workshops, and networking opportunities with 500+ professionals.",
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    location: "Convention Center, San Francisco, CA",
    price: 299,
    maxAttendees: 500,
    currentAttendees: 0,
    category: "technology",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    organizer: "Tech Events Inc.",
    tags: ["AI", "Innovation", "Networking", "Technology"]
  },
  {
    title: "Digital Marketing Masterclass",
    description: "Master the art of digital marketing with industry experts. Learn advanced SEO strategies, social media marketing, content creation, and data analytics. Perfect for marketers, entrepreneurs, and business owners looking to scale their digital presence.",
    date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
    location: "Business Center, New York, NY",
    price: 199,
    maxAttendees: 150,
    currentAttendees: 0,
    category: "marketing",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    organizer: "Marketing Pro Academy",
    tags: ["SEO", "Social Media", "Analytics", "Growth"]
  },
  {
    title: "Sustainable Business Conference",
    description: "Explore sustainable business practices and environmental responsibility in the corporate world. Learn about green technologies, sustainable supply chains, and how to build eco-friendly business models that drive both profit and positive impact.",
    date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    location: "Eco Center, Seattle, WA",
    price: 249,
    maxAttendees: 300,
    currentAttendees: 0,
    category: "sustainability",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    organizer: "Green Business Alliance",
    tags: ["Sustainability", "Environment", "ESG", "Green Tech"]
  },
  {
    title: "Leadership Excellence Workshop",
    description: "Develop your leadership skills with world-class trainers and executive coaches. This intensive workshop covers emotional intelligence, team management, strategic thinking, and communication skills essential for modern leaders.",
    date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
    location: "Executive Training Center, Chicago, IL",
    price: 399,
    maxAttendees: 50,
    currentAttendees: 0,
    category: "leadership",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    organizer: "Leadership Institute",
    tags: ["Leadership", "Management", "Soft Skills", "Executive"]
  },
  {
    title: "FinTech Innovation Forum",
    description: "Discover the future of financial technology with industry pioneers. Explore blockchain, cryptocurrency, digital banking, and fintech solutions that are revolutionizing the financial services industry.",
    date: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000), // 75 days from now
    location: "Financial District, Boston, MA",
    price: 349,
    maxAttendees: 200,
    currentAttendees: 0,
    category: "finance",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    organizer: "FinTech Association",
    tags: ["Blockchain", "Cryptocurrency", "Digital Banking", "Innovation"]
  },
  {
    title: "Healthcare Technology Summit",
    description: "Explore the intersection of healthcare and technology. Learn about telemedicine, AI in healthcare, medical devices, and digital health solutions that are transforming patient care and medical practice.",
    date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
    location: "Medical Center, Austin, TX",
    price: 279,
    maxAttendees: 250,
    currentAttendees: 0,
    category: "healthcare",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    organizer: "HealthTech Foundation",
    tags: ["Telemedicine", "AI Healthcare", "Medical Devices", "Digital Health"]
  }
];

async function seedEvents() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/event-management');
    console.log('✅ Connected to MongoDB');

    // Clear existing events
    await Event.deleteMany({});
    console.log('✅ Cleared existing events');

    // Insert new events
    const createdEvents = await Event.insertMany(professionalEvents);
    console.log(`✅ Created ${createdEvents.length} professional events:`);
    
    createdEvents.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title} - $${event.price} - ${event.category}`);
    });

    console.log('\n🎉 Professional events seeded successfully!');
    console.log('\n📋 Event Summary:');
    console.log('• Tech Innovation Summit 2024 - $299');
    console.log('• Digital Marketing Masterclass - $199');
    console.log('• Sustainable Business Conference - $249');
    console.log('• Leadership Excellence Workshop - $399');
    console.log('• FinTech Innovation Forum - $349');
    console.log('• Healthcare Technology Summit - $279');

  } catch (error) {
    console.error('❌ Error seeding events:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

seedEvents();
