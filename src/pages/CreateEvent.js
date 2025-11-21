import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaCalendarAlt, FaMapMarkerAlt, FaRupeeSign, FaUsers, FaImage, FaTag } from 'react-icons/fa';
import './CreateEvent.css';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    price: '',
    image: '',
    category: 'other',
    maxAttendees: '100',
    organizer: '',
    contactEmail: '',
    contactPhone: '',
    tags: '',
    requirements: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: 'conference', label: 'Conference', icon: '🎤', description: 'Professional conferences and seminars' },
    { value: 'workshop', label: 'Workshop', icon: '🔧', description: 'Hands-on learning sessions' },
    { value: 'concert', label: 'Concert', icon: '🎵', description: 'Musical performances and shows' },
    { value: 'sports', label: 'Sports', icon: '⚽', description: 'Athletic events and competitions' },
    { value: 'exhibition', label: 'Exhibition', icon: '🎨', description: 'Art shows and cultural displays' },
    { value: 'networking', label: 'Networking', icon: '🤝', description: 'Professional networking events' },
    { value: 'charity', label: 'Charity', icon: '❤️', description: 'Fundraising and charity events' },
    { value: 'other', label: 'Other', icon: '📅', description: 'Other types of events' }
  ];

  const { title, description, date, time, location, price, image, category, maxAttendees, organizer, contactEmail, contactPhone, tags, requirements } = formData;

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!title.trim()) newErrors.title = 'Event title is required';
    if (!description.trim()) newErrors.description = 'Event description is required';
    if (!date) newErrors.date = 'Event date is required';
    if (!location.trim()) newErrors.location = 'Event location is required';
    if (!price || price === '') newErrors.price = 'Event price is required';
    if (!organizer.trim()) newErrors.organizer = 'Organizer name is required';
    if (!contactEmail.trim()) newErrors.contactEmail = 'Contact email is required';

    // Format validation
    if (title && title.length < 5) newErrors.title = 'Title must be at least 5 characters';
    if (description && description.length < 20) newErrors.description = 'Description must be at least 20 characters';
    if (price && (parseFloat(price) < 0)) newErrors.price = 'Price cannot be negative';
    if (maxAttendees && parseInt(maxAttendees) < 1) newErrors.maxAttendees = 'Maximum attendees must be at least 1';
    if (contactEmail && !/\S+@\S+\.\S+/.test(contactEmail)) newErrors.contactEmail = 'Please enter a valid email address';
    if (contactPhone && !/^[\+]?[1-9][\d]{0,15}$/.test(contactPhone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.contactPhone = 'Please enter a valid phone number';
    }

    // Date validation
    if (date) {
      const eventDate = new Date(date);
      const now = new Date();
      if (eventDate <= now) newErrors.date = 'Event date must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to create events');
        navigate('/login');
        return;
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };

      // Combine date and time if time is provided
      let eventDateTime = date;
      if (time) {
        const [hours, minutes] = time.split(':');
        const eventDate = new Date(date);
        eventDate.setHours(parseInt(hours), parseInt(minutes));
        eventDateTime = eventDate.toISOString();
      }

      const eventData = {
        title: title.trim(),
        description: description.trim(),
        date: eventDateTime,
        location: location.trim(),
        price: parseFloat(price),
        image: image || 'https://via.placeholder.com/400x300?text=Event+Image',
        category,
        maxAttendees: parseInt(maxAttendees),
        organizer: {
          name: organizer.trim(),
          email: contactEmail.trim(),
          phone: contactPhone.trim()
        },
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        requirements: requirements.trim()
      };

      const res = await axios.post('/api/events', eventData, config);

      toast.success('Event created successfully!');
      navigate('/events');
    } catch (err) {
      console.error('Create event error:', err);
      const error = err.response?.data?.msg || err.response?.data?.errors?.[0]?.msg || 'Failed to create event';
      toast.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-event-container">
      <div className="create-event-header">
        <h1>Create New Event</h1>
        <p>Share your amazing event with the community</p>
      </div>

      <form onSubmit={onSubmit} className="create-event-form">
        <div className="form-sections">
          {/* Basic Information */}
          <div className="form-section">
            <h3 className="section-title">Basic Information</h3>
            <div className="form-grid">
              {/* Event Title */}
              <div className="form-group full-width">
                <label htmlFor="title">
                  <FaCalendarAlt className="label-icon" />
                  Event Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={title}
                  onChange={onChange}
                  placeholder="Enter event title"
                  className={errors.title ? 'error' : ''}
                />
                {errors.title && <span className="error-message">{errors.title}</span>}
              </div>

              {/* Event Description */}
              <div className="form-group full-width">
                <label htmlFor="description">
                  Event Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={onChange}
                  placeholder="Describe your event in detail"
                  rows="4"
                  className={errors.description ? 'error' : ''}
                />
                {errors.description && <span className="error-message">{errors.description}</span>}
              </div>

              {/* Date and Time */}
              <div className="form-group">
                <label htmlFor="date">
                  <FaCalendarAlt className="label-icon" />
                  Date *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={date}
                  onChange={onChange}
                  className={errors.date ? 'error' : ''}
                />
                {errors.date && <span className="error-message">{errors.date}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="time">
                  Time (Optional)
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={time}
                  onChange={onChange}
                />
              </div>

              {/* Location */}
              <div className="form-group">
                <label htmlFor="location">
                  <FaMapMarkerAlt className="label-icon" />
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={location}
                  onChange={onChange}
                  placeholder="Event location"
                  className={errors.location ? 'error' : ''}
                />
                {errors.location && <span className="error-message">{errors.location}</span>}
              </div>

              {/* Category */}
              <div className="form-group">
                <label htmlFor="category">
                  <FaTag className="label-icon" />
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={category}
                  onChange={onChange}
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
                <div className="category-description">
                  {categories.find(cat => cat.value === category)?.description}
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Capacity */}
          <div className="form-section">
            <h3 className="section-title">Pricing & Capacity</h3>
            <div className="form-grid">
              {/* Price */}
              <div className="form-group">
                <label htmlFor="price">
                  <FaRupeeSign className="label-icon" />
                  Price (INR) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={price}
                  onChange={onChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className={errors.price ? 'error' : ''}
                />
                {errors.price && <span className="error-message">{errors.price}</span>}
              </div>

              {/* Max Attendees */}
              <div className="form-group">
                <label htmlFor="maxAttendees">
                  <FaUsers className="label-icon" />
                  Max Attendees
                </label>
                <input
                  type="number"
                  id="maxAttendees"
                  name="maxAttendees"
                  value={maxAttendees}
                  onChange={onChange}
                  placeholder="100"
                  min="1"
                  className={errors.maxAttendees ? 'error' : ''}
                />
                {errors.maxAttendees && <span className="error-message">{errors.maxAttendees}</span>}
              </div>
            </div>
          </div>

          {/* Organizer Information */}
          <div className="form-section">
            <h3 className="section-title">Organizer Information</h3>
            <div className="form-grid">
              {/* Organizer Name */}
              <div className="form-group">
                <label htmlFor="organizer">
                  Organizer Name *
                </label>
                <input
                  type="text"
                  id="organizer"
                  name="organizer"
                  value={organizer}
                  onChange={onChange}
                  placeholder="Your name or organization"
                  className={errors.organizer ? 'error' : ''}
                />
                {errors.organizer && <span className="error-message">{errors.organizer}</span>}
              </div>

              {/* Contact Email */}
              <div className="form-group">
                <label htmlFor="contactEmail">
                  Contact Email *
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={contactEmail}
                  onChange={onChange}
                  placeholder="your@email.com"
                  className={errors.contactEmail ? 'error' : ''}
                />
                {errors.contactEmail && <span className="error-message">{errors.contactEmail}</span>}
              </div>

              {/* Contact Phone */}
              <div className="form-group">
                <label htmlFor="contactPhone">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  id="contactPhone"
                  name="contactPhone"
                  value={contactPhone}
                  onChange={onChange}
                  placeholder="+1 (555) 123-4567"
                  className={errors.contactPhone ? 'error' : ''}
                />
                {errors.contactPhone && <span className="error-message">{errors.contactPhone}</span>}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="form-section">
            <h3 className="section-title">Additional Information</h3>
            <div className="form-grid">
              {/* Image URL */}
              <div className="form-group">
                <label htmlFor="image">
                  <FaImage className="label-icon" />
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={image}
                  onChange={onChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Tags */}
              <div className="form-group">
                <label htmlFor="tags">
                  Tags (Optional)
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={tags}
                  onChange={onChange}
                  placeholder="networking, technology, free (comma separated)"
                />
                <small>Separate tags with commas</small>
              </div>

              {/* Requirements */}
              <div className="form-group full-width">
                <label htmlFor="requirements">
                  Special Requirements (Optional)
                </label>
                <textarea
                  id="requirements"
                  name="requirements"
                  value={requirements}
                  onChange={onChange}
                  placeholder="Any special requirements or notes for attendees"
                  rows="3"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Image Preview */}
        {image && (
          <div className="image-preview">
            <h4>Image Preview:</h4>
            <img
              src={image}
              alt="Event preview"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/events')}
            className="cancel-btn"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="submit-btn"
          >
            {isSubmitting ? 'Creating Event...' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
