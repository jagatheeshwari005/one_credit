import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUsers, FaMapMarkerAlt, FaArrowRight, FaTicketAlt, FaStar } from 'react-icons/fa';
import axios from 'axios';
import EventCard from '../components/EventCard';
import Carousel from '../components/Carousel';
import './Home.css';

const Home = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  const fetchUpcomingEvents = async () => {
    try {
      const res = await axios.get('/api/events');
      // Get the first 6 upcoming events
      const upcoming = res.data
        .filter(event => new Date(event.date) > new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 6);
      setUpcomingEvents(upcoming);
    } catch (err) {
      console.error('Error fetching upcoming events:', err);
    } finally {
      setLoading(false);
    }
  };

  // Carousel images data
  const carouselImages = [
    {
      src: '/marriage.jpg',
      alt: 'Wedding Events',
      caption: {
        title: 'Beautiful Wedding Events',
        description: 'Create unforgettable moments with our premium wedding event services'
      }
    },
    {
      src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      alt: 'Corporate Events',
      caption: {
        title: 'Professional Corporate Events',
        description: 'Host successful business meetings, conferences, and corporate gatherings'
      }
    },
    {
      src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      alt: 'Birthday Parties',
      caption: {
        title: 'Memorable Birthday Celebrations',
        description: 'Make every birthday special with our creative party planning services'
      }
    },
    {
      src: 'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      alt: 'Conferences',
      caption: {
        title: 'Professional Conferences',
        description: 'Organize successful conferences and seminars with our expert team'
      }
    }
  ];

  return (
    <div className="home-page">
      {/* Carousel Section */}
      <section className="carousel-section">
        <div className="carousel-wrapper">
          <Carousel images={carouselImages} autoPlay={true} interval={4000} />
        </div>
      </section>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container mx-auto px-4 py-16">
          <div className="hero-content">
            <h1 className="title">Discover Amazing Events</h1>
            <p className="subtitle">
              Join thousands of people at the most exciting events in your area. 
              From conferences to concerts, workshops to exhibitions - find your next adventure.
            </p>
            <div className="hero-actions">
              <Link to="/events" className="cta-button">
                Explore Events <FaArrowRight className="icon" />
              </Link>
              <Link to="/register" className="secondary-button">
                Join Our Community
              </Link>
            </div>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <FaUsers className="stat-icon" />
              <div className="stat-content">
                <span className="stat-number">0</span>
                <span className="stat-label">Active Users</span>
              </div>
            </div>
            <div className="stat-item">
              <FaCalendarAlt className="stat-icon" />
              <div className="stat-content">
                <span className="stat-number">0</span>
                <span className="stat-label">Events Monthly</span>
              </div>
            </div>
            <div className="stat-item">
              <FaStar className="stat-icon" />
              <div className="stat-content">
                <span className="stat-number">0</span>
                <span className="stat-label">User Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="upcoming-events-section">
        <div className="container mx-auto px-4 py-16">
          <div className="section-header">
            <div className="header-content">
              <h2 className="section-title">Upcoming Events</h2>
              <p className="section-subtitle">Don't miss out on these amazing events happening soon</p>
            </div>
            <Link to="/events" className="view-all-link">
              View All Events <FaArrowRight className="icon" />
            </Link>
          </div>
          
          {loading ? (
            <div className="loading">Loading upcoming events...</div>
          ) : upcomingEvents.length > 0 ? (
            <div className="events-grid">
              {upcomingEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <div className="no-events">
              <FaCalendarAlt className="no-events-icon" />
              <h3>No upcoming events</h3>
              <p>Check back later for new events or create your own!</p>
              <Link to="/create-event" className="cta-button">
                Create Event
              </Link>
            </div>
          )}
        </div>
      </section>

      
      {/* Features Section */}
      <section className="features-section">
        <div className="container mx-auto px-4 py-16">
          <h2 className="section-title">Why Choose Our Platform</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="icon-wrapper">
                <FaCalendarAlt className="icon" />
              </div>
              <h3 className="card-title">Easy Event Creation</h3>
              <p className="card-description">Create and manage your events in just a few clicks with our intuitive interface.</p>
            </div>
            
            <div className="feature-card">
              <div className="icon-wrapper">
                <FaUsers className="icon" />
              </div>
              <h3 className="card-title">Manage Attendees</h3>
              <p className="card-description">Keep track of your event attendees and send them important updates.</p>
            </div>
            
            <div className="feature-card">
              <div className="icon-wrapper">
                <FaMapMarkerAlt className="icon" />
              </div>
              <h3 className="card-title">Location Services</h3>
              <p className="card-description">Find the perfect venue and provide directions to your event location.</p>
            </div>

            <div className="feature-card">
              <div className="icon-wrapper">
                <FaTicketAlt className="icon" />
              </div>
              <h3 className="card-title">Easy Booking</h3>
              <p className="card-description">Simple and secure booking process for all your favorite events.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container mx-auto px-4 py-16">
          <div className="cta-content">
            <h2 className="section-title">Ready to Get Started?</h2>
            <p className="subtitle">
              Join our community of event organizers and attendees. Create amazing events or discover your next adventure.
            </p>
            <div className="cta-actions">
              <Link to="/register" className="cta-button">
                Sign Up for Free
              </Link>
              <Link to="/events" className="secondary-button">
                Browse Events
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
