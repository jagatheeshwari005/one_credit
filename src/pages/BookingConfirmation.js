import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaCheckCircle, FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaGift, FaPhone, FaEnvelope, FaUser } from 'react-icons/fa';
import './BookingConfirmation.css';

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes to pay

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  useEffect(() => {
    let intervalId;
    let pollId;
    if (booking && booking.paymentStatus === 'pending') {
      setPolling(true);
      // Poll booking status every 5 seconds
      pollId = setInterval(() => {
        fetchBooking();
      }, 5000);

      // Countdown timer for payment timeout
      intervalId = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // time out: cancel booking automatically via API
            cancelBooking();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(pollId);
      clearInterval(intervalId);
      setPolling(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking]);

  const fetchBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { 'x-auth-token': token }
      };

      const res = await axios.get(`/api/bookings/${bookingId}`, config);
      setBooking(res.data);
      setLoading(false);
    } catch (err) {
      toast.error('Booking not found');
      setLoading(false);
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

  const cancelBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };
      await axios.put(`/api/bookings/${bookingId}/cancel`, {}, config);
      toast.info('Booking cancelled due to non-payment');
      fetchBooking();
    } catch (err) {
      console.error('Auto-cancel error', err);
    }
  };

  const confirmPaymentManually = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };
      await axios.post(`/api/bookings/${bookingId}/confirm-payment`, {}, config);
      toast.success('Payment confirmed');
      fetchBooking();
    } catch (err) {
      const error = err.response?.data?.msg || 'Failed to confirm payment';
      toast.error(error);
    }
  };

  const formatCountdown = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
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

  if (loading) {
    return <div className="loading">Loading booking details...</div>;
  }

  if (!booking) {
    return (
      <div className="booking-not-found">
        <h2>Booking Not Found</h2>
        <p>The booking you're looking for doesn't exist or you don't have permission to view it.</p>
        <Link to="/events" className="btn-primary">Back to Events</Link>
      </div>
    );
  }

  const UPI_ID = 'jagatheeshlogu005-2@oksbi';
  const qrSrc = '/images/upi_qr.png';

  return (
    <div className="booking-confirmation-container">
      <div className="confirmation-header">
        <FaCheckCircle className="success-icon" />
        <h1>Booking Confirmed!</h1>
        <p>Your event has been successfully booked. Here are your booking details:</p>
      </div>

      <div className="confirmation-content">
        {/* Booking Summary Card */}
        <div className="booking-summary-card">
          <div className="confirmation-number">
            <h3>Confirmation Number</h3>
            <span className="conf-number">{booking.confirmationNumber}</span>
          </div>

          <div className="booking-status">
            <span className={`status-badge ${booking.status}`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
            <span className={`payment-badge ${booking.paymentStatus}`}>
              Payment: {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
            </span>
          </div>
          {booking.paymentStatus === 'pending' && (
            <div className="payment-qr-section">
              <h4>Pay via UPI</h4>
              <div className="qr-card">
                <img src={qrSrc} alt="UPI QR" className="upi-qr-image" />
                <div className="upi-id">UPI ID: {UPI_ID}</div>
              </div>
              <p>Scan the QR code with any UPI app and pay the total amount shown below.</p>
              <div className="payment-actions">
                <button onClick={confirmPaymentManually} className="btn-primary">I Have Paid (Confirm)</button>
                <button onClick={cancelBooking} className="btn-secondary">Cancel Booking</button>
                <div className="payment-timer">Time left to pay: {formatCountdown(timeLeft)}</div>
              </div>
            </div>
          )}
        </div>

        {/* Event Details */}
        <div className="event-details-section">
          <h3>Event Details</h3>
          <div className="event-card">
            <img 
              src={booking.event.image || 'https://via.placeholder.com/400x300?text=Event+Image'} 
              alt={booking.event.title}
              className="event-image"
            />
            <div className="event-info">
              <h4>{booking.event.title}</h4>
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
              </div>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="booking-details-section">
          <h3>Booking Information</h3>
          <div className="details-grid">
            <div className="detail-item">
              <strong>Number of Attendees:</strong>
              <span>{booking.attendees}</span>
            </div>
            <div className="detail-item">
              <strong>Event Cost:</strong>
              <span>{formatPrice(booking.event.price * booking.attendees)}</span>
            </div>
            {booking.decorationPackage !== 'none' && (
              <>
                <div className="detail-item">
                  <FaGift className="detail-icon" />
                  <strong>Decoration Package:</strong>
                  <span>{getDecorationPackageName(booking.decorationPackage)}</span>
                </div>
                <div className="detail-item">
                  <strong>Decoration Cost:</strong>
                  <span>{formatPrice(booking.decorationCost)}</span>
                </div>
              </>
            )}
            <div className="detail-item total">
              <strong>Total Amount:</strong>
              <span>{formatPrice(booking.totalAmount)}</span>
            </div>
            <div className="detail-item">
              <strong>Booking Date:</strong>
              <span>{formatDate(booking.bookingDate)}</span>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="contact-info-section">
          <h3>Contact Information</h3>
          <div className="contact-details">
            <div className="contact-item">
              <FaUser className="contact-icon" />
              <span>{booking.contactInfo.name}</span>
            </div>
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <span>{booking.contactInfo.email}</span>
            </div>
            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <span>{booking.contactInfo.phone}</span>
            </div>
          </div>
        </div>

        {/* Special Requests */}
        {booking.specialRequests && (
          <div className="special-requests-section">
            <h3>Special Requests</h3>
            <p className="special-requests">{booking.specialRequests}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="action-buttons">
          <Link to="/my-bookings" className="btn-secondary">
            View All Bookings
          </Link>
          <Link to="/events" className="btn-primary">
            Book Another Event
          </Link>
          <button 
            onClick={() => window.print()} 
            className="btn-outline"
          >
            Print Confirmation
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
