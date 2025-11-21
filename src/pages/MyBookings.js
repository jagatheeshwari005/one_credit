import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaGift, FaEye, FaTimes } from 'react-icons/fa';
import './MyBookings.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { 'x-auth-token': token }
      };

      const res = await axios.get('/api/bookings', config);
      setBookings(res.data);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch bookings');
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { 'x-auth-token': token }
      };

      await axios.put(`/api/bookings/${bookingId}/cancel`, {}, config);
      toast.success('Booking cancelled successfully');
      fetchBookings(); // Refresh the list
    } catch (err) {
      const error = err.response?.data?.msg || 'Failed to cancel booking';
      toast.error(error);
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
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const getDecorationPackageName = (pkg) => {
    const packages = {
      none: 'No Decoration',
      basic: 'Basic Package',
      premium: 'Premium Package',
      luxury: 'Luxury Package'
    };
    return packages[pkg] || 'Unknown';
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'cancelled': return 'status-cancelled';
      case 'pending': return 'status-pending';
      default: return 'status-pending';
    }
  };

  if (loading) {
    return <div className="loading">Loading your bookings...</div>;
  }

  return (
    <div className="my-bookings-container">
      <div className="bookings-header">
        <h1>My Bookings</h1>
        <p>Manage and view all your event bookings</p>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All Bookings ({bookings.length})
        </button>
        <button 
          className={filter === 'confirmed' ? 'active' : ''}
          onClick={() => setFilter('confirmed')}
        >
          Confirmed ({bookings.filter(b => b.status === 'confirmed').length})
        </button>
        <button 
          className={filter === 'cancelled' ? 'active' : ''}
          onClick={() => setFilter('cancelled')}
        >
          Cancelled ({bookings.filter(b => b.status === 'cancelled').length})
        </button>
      </div>

      {/* Bookings List */}
      <div className="bookings-list">
        {filteredBookings.length === 0 ? (
          <div className="no-bookings">
            <h3>No bookings found</h3>
            <p>You haven't made any bookings yet.</p>
            <Link to="/events" className="btn-primary">
              Browse Events
            </Link>
          </div>
        ) : (
          filteredBookings.map(booking => (
            <div key={booking._id} className="booking-card">
              <div className="booking-header">
                <div className="booking-info">
                  <h3>{booking.event.title}</h3>
                  <span className={`status-badge ${getStatusColor(booking.status)}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
                <div className="booking-actions">
                  <Link 
                    to={`/booking-confirmation/${booking._id}`}
                    className="btn-view"
                    title="View Details"
                  >
                    <FaEye />
                  </Link>
                  {booking.status === 'confirmed' && (
                    <button 
                      onClick={() => handleCancelBooking(booking._id)}
                      className="btn-cancel"
                      title="Cancel Booking"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              </div>

              <div className="booking-content">
                <div className="event-details">
                  <img 
                    src={booking.event.image || 'https://via.placeholder.com/300x200?text=Event+Image'} 
                    alt={booking.event.title}
                    className="event-thumbnail"
                  />
                  <div className="event-meta">
                    <div className="meta-item">
                      <FaCalendarAlt className="meta-icon" />
                      <span>{formatDate(booking.event.date)}</span>
                    </div>
                    <div className="meta-item">
                      <FaMapMarkerAlt className="meta-icon" />
                      <span>{booking.event.location}</span>
                    </div>
                    <div className="meta-item">
                      <FaUsers className="meta-icon" />
                      <span>{booking.attendees} attendee{booking.attendees > 1 ? 's' : ''}</span>
                    </div>
                    {booking.decorationPackage !== 'none' && (
                      <div className="meta-item">
                        <FaGift className="meta-icon" />
                        <span>{getDecorationPackageName(booking.decorationPackage)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="booking-summary">
                  <div className="summary-item">
                    <span className="label">Confirmation #:</span>
                    <span className="value">{booking.confirmationNumber}</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Booking Date:</span>
                    <span className="value">{formatDate(booking.bookingDate)}</span>
                  </div>
                  <div className="summary-item total">
                    <span className="label">Total Amount:</span>
                    <span className="value">{formatPrice(booking.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {filteredBookings.length > 0 && (
        <div className="bookings-footer">
          <Link to="/events" className="btn-secondary">
            Book Another Event
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
