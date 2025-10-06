import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaTicketAlt } from 'react-icons/fa';
import './EventCard.css';

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const handleBookEvent = () => {
    navigate(`/book-event/${event._id}`);
  };

  const handleViewDetails = () => {
    navigate(`/event-details/${event._id}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  const availableSpots = event.maxAttendees - event.currentAttendees;
  const isFullyBooked = availableSpots <= 0;

  return (
    <div className="event-card">
      <div className="event-image-container">
        <img 
          src={event.image || 'https://via.placeholder.com/400x300?text=Event+Image'} 
          alt={event.title}
          className="event-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=Event+Image';
          }}
        />
        <div 
          className="event-category"
          style={{ backgroundColor: getCategoryColor(event.category) }}
        >
          {event.category}
        </div>
        <div className="event-price">
          {formatPrice(event.price)}
        </div>
      </div>

      <div className="event-content">
        <h3 className="event-title">{event.title}</h3>
        <p className="event-description">{event.description}</p>

        <div className="event-details">
          <div className="event-detail">
            <FaCalendarAlt className="detail-icon" />
            <span>{formatDate(event.date)}</span>
          </div>
          
          <div className="event-detail">
            <FaMapMarkerAlt className="detail-icon" />
            <span>{event.location}</span>
          </div>
          
          <div className="event-detail">
            <FaUsers className="detail-icon" />
            <span>
              {availableSpots > 0 
                ? `${availableSpots} spots left` 
                : 'Fully booked'
              }
            </span>
          </div>
        </div>

        <div className="event-actions">
          <button 
            className="view-details-btn"
            onClick={handleViewDetails}
          >
            View Details
          </button>
          <button 
            className={`book-event-btn ${availableSpots === 0 ? 'disabled' : ''}`}
            onClick={handleBookEvent}
            disabled={availableSpots === 0}
          >
            <FaTicketAlt />
            {availableSpots === 0 ? 'Sold Out' : 'Book Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
