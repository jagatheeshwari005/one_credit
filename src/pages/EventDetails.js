import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaTicketAlt, FaArrowLeft, FaEnvelope, FaPhone, FaGlobe } from 'react-icons/fa';
import axios from 'axios';
import './EventDetails.css';

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      const res = await axios.get(`/api/events/${eventId}`);
      setEvent(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching event details:', err);
      setError('Failed to fetch event details');
      setLoading(false);
    }
  };

  const handleBookEvent = () => {
    navigate(`/book-event/${eventId}`);
  };

  const handleBackToEvents = () => {
    navigate('/events');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getCategoryColor = (category) => {
    const colors = {
      conference: '#3B82F6',
      workshop: '#10B981',
      concert: '#F59E0B',
      sports: '#EF4444',
      exhibition: '#8B5CF6',
      other: '#6B7280'
    };
    return colors[category] || colors.other;
  };

  // Resolve image paths so relative URLs (e.g. 'uploads/..') work when served from public/
  const resolveImage = (src) => {
    if (!src) return '';
    if (typeof src !== 'string') return '';
    if (src.startsWith('http') || src.startsWith('/')) return src;
    return `${process.env.PUBLIC_URL || ''}/${src}`;
  };

  // Gallery images (first one comes from event data if available)
  const galleryImages = [
    resolveImage(event?.image) || 'https://via.placeholder.com/800x600?text=Event+Image+1',
    'https://via.placeholder.com/800x600?text=Event+Image+2',
    'https://via.placeholder.com/800x600?text=Event+Image+3',
    'https://via.placeholder.com/800x600?text=Event+Image+4'
  ];

  if (loading) return <div className="loading">Loading event details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!event) return <div className="error">Event not found</div>;

  const availableSpots = event.maxAttendees - event.currentAttendees;
  const isFullyBooked = availableSpots <= 0;

  return (
    <div className="event-details-container">
      {/* Back Button */}
      <button className="back-button" onClick={handleBackToEvents}>
        <FaArrowLeft /> Back to Events
      </button>

      {/* Hero Section */}
      <div className="event-hero">
        <div className="event-hero-content">
          <div className="event-meta">
            <span 
              className="event-category-badge"
              style={{ backgroundColor: getCategoryColor(event.category) }}
            >
              {event.category}
            </span>
            <span className="event-price-badge">
              {formatPrice(event.price)}
            </span>
          </div>
          <h1 className="event-title">{event.title}</h1>
          <p className="event-subtitle">{event.description}</p>
        </div>
      </div>

      <div className="event-details-content">
        {/* Image Gallery */}
        <div className="gallery-section">
          <h2>Event Gallery</h2>
          <div className="gallery-container">
            <div className="main-image">
              <img 
                src={galleryImages[selectedImageIndex]} 
                alt={`${event.title} - Image ${selectedImageIndex + 1}`}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x600?text=Event+Image';
                }}
              />
            </div>
            <div className="thumbnail-grid">
              {galleryImages.map((image, index) => (
                <div 
                  key={index}
                  className={`thumbnail ${selectedImageIndex === index ? 'active' : ''}`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img 
                    src={image} 
                    alt={`Thumbnail ${index + 1}`}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/200x150?text=Thumb';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Event Information */}
        <div className="event-info-section">
          <div className="info-grid">
            {/* Event Details */}
            <div className="info-card">
              <h3>Event Details</h3>
              <div className="detail-item">
                <FaCalendarAlt className="detail-icon" />
                <div>
                  <strong>Date & Time</strong>
                  <p>{formatDate(event.date)}</p>
                </div>
              </div>
              <div className="detail-item">
                <FaMapMarkerAlt className="detail-icon" />
                <div>
                  <strong>Location</strong>
                  <p>{event.location}</p>
                </div>
              </div>
              <div className="detail-item">
                <FaUsers className="detail-icon" />
                <div>
                  <strong>Availability</strong>
                  <p>
                    {availableSpots > 0 
                      ? `${availableSpots} spots available out of ${event.maxAttendees}` 
                      : 'Event is fully booked'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Organizer Information */}
            <div className="info-card">
              <h3>Event Organizer</h3>
              <div className="organizer-info">
                <div className="organizer-avatar">
                  <img 
                    src="https://via.placeholder.com/80x80?text=ORG" 
                    alt="Organizer"
                  />
                </div>
                <div className="organizer-details">
                  <h4>{event.organizer?.name || 'Event Organizer'}</h4>
                  <p>{event.organizer?.title || 'Professional Event Organizer'}</p>
                  <div className="organizer-contact">
                    <div className="contact-item">
                      <FaEnvelope className="contact-icon" />
                      <span>{event.organizer?.email || 'organizer@eventmanager.com'}</span>
                    </div>
                    <div className="contact-item">
                      <FaPhone className="contact-icon" />
                      <span>{event.organizer?.phone || '+1 (555) 123-4567'}</span>
                    </div>
                    <div className="contact-item">
                      <FaGlobe className="contact-icon" />
                      <span>{event.organizer?.website || 'www.eventorganizer.com'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="description-section">
            <h3>About This Event</h3>
            <div className="description-content">
              <p>{event.description}</p>
              <p>
                Join us for an amazing {event.category} experience! This event promises to be 
                an unforgettable gathering of like-minded individuals who share a passion for 
                {event.category === 'conference' ? ' learning and networking' : 
                 event.category === 'workshop' ? ' hands-on learning and skill development' :
                 event.category === 'concert' ? ' music and entertainment' :
                 event.category === 'sports' ? ' athletic competition and sportsmanship' :
                 event.category === 'exhibition' ? ' art, culture, and creativity' :
                 ' community and shared interests'}.
              </p>
              <p>
                Don't miss out on this opportunity to be part of something special. 
                Book your spot today and secure your place at this exclusive event!
              </p>
            </div>
          </div>

          {/* Booking Section */}
          <div className="booking-section">
            <div className="booking-card">
              <div className="booking-info">
                <div className="price-display">
                  <span className="price">{formatPrice(event.price)}</span>
                  <span className="price-label">per ticket</span>
                </div>
                <div className="availability-info">
                  {availableSpots > 0 ? (
                    <span className="available">✓ {availableSpots} spots available</span>
                  ) : (
                    <span className="sold-out">✗ Sold out</span>
                  )}
                </div>
              </div>
              <button 
                className={`book-now-btn ${isFullyBooked ? 'disabled' : ''}`}
                onClick={handleBookEvent}
                disabled={isFullyBooked}
              >
                <FaTicketAlt />
                {isFullyBooked ? 'Sold Out' : 'Book Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
