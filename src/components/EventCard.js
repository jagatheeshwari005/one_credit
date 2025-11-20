import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaTicketAlt } from 'react-icons/fa';
import './EventCard.css';

const EventCard = ({ event, index }) => {
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

  // price removed from card UI; keep formatting in other areas if needed

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

  const [imgError, setImgError] = useState(false);

  // compute image source once for easier debugging.
  // Prefer the local sixth.jpg for the 6th card regardless of event.image (covers cases where event.image exists but is broken)
  const imageSrc = index === 5
    ? `${process.env.PUBLIC_URL || ''}/images/sixth.jpg`
    : (event.image || 'https://via.placeholder.com/800x450?text=Event+Image');

  // reset imgError whenever the computed image source changes so the image will be retried
  useEffect(() => {
    setImgError(false);
  }, [imageSrc]);

  // debug log to help trace missing images
  // open browser console to see the chosen image URL for each card
  // eslint-disable-next-line no-console
  console.debug('EventCard image src for', event.title || event._id, imageSrc);

  return (
    <div className="event-card-component">
      <div className="event-image-container">
        {!imgError ? (
          <img
            src={imageSrc}
            alt={event.title}
            className="event-card-image"
            onError={(e) => {
              // eslint-disable-next-line no-console
              console.warn('Image failed to load for', event._id || event.title, imageSrc, e?.type || 'onError');
              setImgError(true);
            }}
          />
        ) : (
          <div
            className="event-image-fallback"
            aria-hidden="true"
          />
        )}
        <div 
          className="event-category"
          style={{ backgroundColor: getCategoryColor(event.category) }}
        >
          {event.category}
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
