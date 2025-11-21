import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventCard from '../components/EventCard';
import { FaSearch, FaFilter, FaSort, FaCalendarAlt, FaMapMarkerAlt, FaRupeeSign } from 'react-icons/fa';
import './Events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [dateFilter, setDateFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'conference', label: 'Conference' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'concert', label: 'Concert' },
    { value: 'sports', label: 'Sports' },
    { value: 'exhibition', label: 'Exhibition' },
    { value: 'other', label: 'Other' }
  ];

  const sortOptions = [
    { value: 'date', label: 'Date (Upcoming First)' },
    { value: 'date-desc', label: 'Date (Latest First)' },
    { value: 'price', label: 'Price (Low to High)' },
    { value: 'price-desc', label: 'Price (High to Low)' },
    { value: 'title', label: 'Title (A-Z)' },
    { value: 'popularity', label: 'Most Popular' }
  ];

  const dateFilters = [
    { value: 'all', label: 'All Dates' },
    { value: 'today', label: 'Today' },
    { value: 'tomorrow', label: 'Tomorrow' },
    { value: 'this-week', label: 'This Week' },
    { value: 'this-month', label: 'This Month' },
    { value: 'next-month', label: 'Next Month' }
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterAndSortEvents();
  }, [events, searchTerm, selectedCategory, sortBy, priceRange, dateFilter]);

  const fetchEvents = async () => {
    try {
      console.log('Fetching events...');
      const res = await axios.get('/api/events');
      console.log('Events fetched:', res.data);
      setEvents(res.data);
      setError('');
      setLoading(false);
    } catch (err) {
      console.error('Error fetching events:', err);
      console.error('Error response:', err.response?.data);
      setError(`Failed to fetch events: ${err.response?.data?.message || err.message}`);
      setLoading(false);
    }
  };

  const filterAndSortEvents = () => {
    let filtered = [...events];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    // Filter by price range
    if (priceRange.min !== '') {
      filtered = filtered.filter(event => event.price >= parseFloat(priceRange.min));
    }
    if (priceRange.max !== '') {
      filtered = filtered.filter(event => event.price <= parseFloat(priceRange.max));
    }

    // Filter by date
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const monthAfter = new Date(today);
    monthAfter.setMonth(monthAfter.getMonth() + 2);

    switch (dateFilter) {
      case 'today':
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= today && eventDate < tomorrow;
        });
        break;
      case 'tomorrow':
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= tomorrow && eventDate < new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000);
        });
        break;
      case 'this-week':
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= today && eventDate < nextWeek;
        });
        break;
      case 'this-month':
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= today && eventDate < nextMonth;
        });
        break;
      case 'next-month':
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= nextMonth && eventDate < monthAfter;
        });
        break;
    }

    // Sort events
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date) - new Date(b.date);
        case 'date-desc':
          return new Date(b.date) - new Date(a.date);
        case 'price':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'popularity':
          return (b.currentAttendees || 0) - (a.currentAttendees || 0);
        default:
          return 0;
      }
    });

    setFilteredEvents(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('date');
    setPriceRange({ min: '', max: '' });
    setDateFilter('all');
  };

  if (loading) return <div className="loading">Loading events...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="events-container">
      <div className="events-header">
        <h1>Discover Amazing Events</h1>
        <p>Find and join the most exciting events happening around you</p>
      </div>

      {/* Enhanced Search and Filter Section */}
      <div className="events-controls">
        <div className="search-section">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search events, organizers, or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <button
            className="filter-toggle-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter className="icon" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="advanced-filters">
            <div className="filter-row">
              <div className="filter-group">
                <label>
                  <FaFilter className="label-icon" />
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="filter-select"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>
                  <FaSort className="label-icon" />
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>
                  <FaCalendarAlt className="label-icon" />
                  Date Range
                </label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="filter-select"
                >
                  {dateFilters.map(filter => (
                    <option key={filter.value} value={filter.value}>
                      {filter.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="filter-row">
              <div className="filter-group">
                <label>
                  <FaRupeeSign className="label-icon" />
                  Price Range (INR)
                </label>
                <div className="price-range">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="price-input"
                  />
                  <span>to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="price-input"
                  />
                </div>
              </div>

              <div className="filter-actions">
                <button onClick={clearFilters} className="clear-filters-btn">
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Info */}
      <div className="results-info">
        <div className="results-stats">
          <span className="results-count">
            {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
          </span>
          {filteredEvents.length > 0 && (
            <span className="results-sort">
              Sorted by {sortOptions.find(opt => opt.value === sortBy)?.label}
            </span>
          )}
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="no-events">
          <div className="no-events-content">
            <FaCalendarAlt className="no-events-icon" />
            <h3>No events found</h3>
            <p>Try adjusting your search or filter criteria</p>
            <button onClick={clearFilters} className="clear-filters-btn">
              Clear All Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="events-grid">
          {filteredEvents.map((event, idx) => (
            <EventCard key={event._id} event={event} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
