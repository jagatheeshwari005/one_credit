import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaCalendarAlt, FaMapMarkerAlt, FaDollarSign, FaUsers, FaStar, FaGift } from 'react-icons/fa';
import './BookEvent.css';

const BookEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [decorationPackages, setDecorationPackages] = useState({});
  
  const [formData, setFormData] = useState({
    attendees: 1,
    decorationPackage: 'none',
    specialRequests: '',
    contactInfo: {
      name: '',
      email: '',
      phone: ''
    }
  });

  useEffect(() => {
    fetchEvent();
    fetchDecorationPackages();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const res = await axios.get(`/api/events/${eventId}`);
      setEvent(res.data);
      setLoading(false);
    } catch (err) {
      toast.error('Event not found');
      navigate('/events');
    }
  };

  const fetchDecorationPackages = async () => {
    try {
      const res = await axios.get('/api/bookings/decoration-packages');
      setDecorationPackages(res.data);
    } catch (err) {
      console.error('Failed to fetch decoration packages');
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const calculateTotal = () => {
    if (!event) return 0;
    const eventCost = event.price * formData.attendees;
    const decorationCost = decorationPackages[formData.decorationPackage]?.price || 0;
    return eventCost + decorationCost;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.contactInfo.name || !formData.contactInfo.email || !formData.contactInfo.phone) {
      toast.error('Please fill in all contact information');
      return;
    }

    const availableSpots = event.maxAttendees - event.currentAttendees;
    if (formData.attendees > availableSpots) {
      toast.error(`Only ${availableSpots} spots available`);
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to book events');
        navigate('/login');
        return;
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };

      const bookingData = {
        eventId,
        ...formData
      };

      const res = await axios.post('/api/bookings', bookingData, config);
      
      toast.success('Event booked successfully!');
      navigate(`/booking-confirmation/${res.data.booking._id}`);
    } catch (err) {
      const error = err.response?.data?.msg || 'Failed to book event';
      toast.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
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

  if (loading) {
    return <div className="loading">Loading event details...</div>;
  }

  if (!event) {
    return <div className="error">Event not found</div>;
  }

  const availableSpots = event.maxAttendees - event.currentAttendees;

  return (
    <div className="book-event-container">
      <div className="book-event-header">
        <h1>Book Event</h1>
        <p>Complete your booking for this amazing event</p>
      </div>

      <div className="booking-content">
        {/* Event Details Card */}
        <div className="event-details-card">
          <img 
            src={event.image || 'https://via.placeholder.com/400x300?text=Event+Image'} 
            alt={event.title}
            className="event-image"
          />
          <div className="event-info">
            <h2>{event.title}</h2>
            <p className="event-description">{event.description}</p>
            
            <div className="event-meta">
              <div className="meta-item">
                <FaCalendarAlt className="meta-icon" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="meta-item">
                <FaMapMarkerAlt className="meta-icon" />
                <span>{event.location}</span>
              </div>
              <div className="meta-item">
                <FaDollarSign className="meta-icon" />
                <span>{formatPrice(event.price)} per person</span>
              </div>
              <div className="meta-item">
                <FaUsers className="meta-icon" />
                <span>{availableSpots} spots available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={onSubmit} className="booking-form">
          <h3>Booking Details</h3>
          
          {/* Number of Attendees */}
          <div className="form-group">
            <label htmlFor="attendees">
              <FaUsers className="label-icon" />
              Number of Attendees
            </label>
            <input
              type="number"
              id="attendees"
              name="attendees"
              value={formData.attendees}
              onChange={onChange}
              min="1"
              max={availableSpots}
              required
            />
          </div>

          {/* Decoration Package */}
          <div className="form-group">
            <label htmlFor="decorationPackage">
              <FaGift className="label-icon" />
              Event Decoration Package
            </label>
            <select
              id="decorationPackage"
              name="decorationPackage"
              value={formData.decorationPackage}
              onChange={onChange}
            >
              {Object.entries(decorationPackages).map(([key, pkg]) => (
                <option key={key} value={key}>
                  {pkg.name} - {formatPrice(pkg.price)}
                </option>
              ))}
            </select>
          </div>

          {/* Decoration Package Details */}
          {formData.decorationPackage !== 'none' && (
            <div className="decoration-info">
              <h4>Decoration Package Includes:</h4>
              <ul>
                {formData.decorationPackage === 'basic' && (
                  <>
                    <li>Basic table decorations</li>
                    <li>Balloon arrangements</li>
                    <li>Welcome banner</li>
                  </>
                )}
                {formData.decorationPackage === 'premium' && (
                  <>
                    <li>Premium floral arrangements</li>
                    <li>Themed decorations</li>
                    <li>Professional lighting</li>
                    <li>Custom backdrop</li>
                  </>
                )}
                {formData.decorationPackage === 'luxury' && (
                  <>
                    <li>Luxury floral displays</li>
                    <li>Premium themed decorations</li>
                    <li>Professional lighting & sound</li>
                    <li>Custom photo booth</li>
                    <li>Dedicated decoration coordinator</li>
                  </>
                )}
              </ul>
            </div>
          )}

          {/* Contact Information */}
          <div className="contact-section">
            <h4>Contact Information</h4>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="contactInfo.name"
                  value={formData.contactInfo.name}
                  onChange={onChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="contactInfo.email"
                  value={formData.contactInfo.email}
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="contactInfo.phone"
                value={formData.contactInfo.phone}
                onChange={onChange}
                required
              />
            </div>
          </div>

          {/* Special Requests */}
          <div className="form-group">
            <label htmlFor="specialRequests">Special Requests (Optional)</label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={onChange}
              placeholder="Any special requirements or requests for your event..."
              rows="3"
            />
          </div>

          {/* Booking Summary */}
          <div className="booking-summary">
            <h4>Booking Summary</h4>
            <div className="summary-row">
              <span>Event Cost ({formData.attendees} × {formatPrice(event.price)})</span>
              <span>{formatPrice(event.price * formData.attendees)}</span>
            </div>
            {formData.decorationPackage !== 'none' && (
              <div className="summary-row">
                <span>Decoration Package</span>
                <span>{formatPrice(decorationPackages[formData.decorationPackage]?.price || 0)}</span>
              </div>
            )}
            <div className="summary-row total">
              <span>Total Amount</span>
              <span>{formatPrice(calculateTotal())}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={submitting || availableSpots === 0}
            className="book-btn"
          >
            {submitting ? 'Processing...' : `Book Event - ${formatPrice(calculateTotal())}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookEvent;
