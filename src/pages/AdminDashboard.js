import React, { useState, useEffect } from 'react';
import { FaUsers, FaUserShield, FaUserCheck, FaUserTimes, FaGoogle, FaTrash, FaToggleOn, FaToggleOff, FaCalendarAlt, FaTicketAlt, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({});
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    fetchUsers();
    fetchBookings();
    fetchDashboardStats();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };

      const res = await axios.get('/api/admin/users', config);
      setUsers(res.data.users);
      setStats(res.data.stats);
      setLoading(false);
    } catch (err) {
      const error = err.response?.data?.msg || 'Failed to fetch users';
      toast.error(error);
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };

      const res = await axios.get('/api/admin/bookings', config);
      setBookings(res.data.bookings);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };

      const res = await axios.get('/api/admin/dashboard', config);
      setDashboardStats(res.data);
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    }
  };

  const toggleUserStatus = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };

      await axios.put(`/api/admin/users/${userId}/status`, {}, config);
      toast.success('User status updated successfully');
      fetchUsers(); // Refresh the list
    } catch (err) {
      const error = err.response?.data?.msg || 'Failed to update user status';
      toast.error(error);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      };

      await axios.put(`/api/admin/users/${userId}/role`, { role: newRole }, config);
      toast.success('User role updated successfully');
      fetchUsers(); // Refresh the list
    } catch (err) {
      const error = err.response?.data?.msg || 'Failed to update user role';
      toast.error(error);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };

      await axios.delete(`/api/admin/users/${userId}`, config);
      toast.success('User deleted successfully');
      fetchUsers(); // Refresh the list
    } catch (err) {
      const error = err.response?.data?.msg || 'Failed to delete user';
      toast.error(error);
    }
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

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage users and view system statistics</p>
      </div>

      {/* Dashboard Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <FaUsers className="stat-icon" />
          <div className="stat-info">
            <h3>{dashboardStats.totalUsers || 0}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <FaUserCheck className="stat-icon active" />
          <div className="stat-info">
            <h3>{dashboardStats.activeUsers || 0}</h3>
            <p>Active Users</p>
          </div>
        </div>
        <div className="stat-card">
          <FaTicketAlt className="stat-icon booking" />
          <div className="stat-info">
            <h3>{dashboardStats.totalBookings || 0}</h3>
            <p>Total Bookings</p>
          </div>
        </div>
        <div className="stat-card">
          <FaCalendarAlt className="stat-icon event" />
          <div className="stat-info">
            <h3>{dashboardStats.totalEvents || 0}</h3>
            <p>Total Events</p>
          </div>
        </div>
        <div className="stat-card">
          <FaUserShield className="stat-icon admin" />
          <div className="stat-info">
            <h3>{dashboardStats.adminUsers || 0}</h3>
            <p>Admins</p>
          </div>
        </div>
        <div className="stat-card">
          <FaGoogle className="stat-icon google" />
          <div className="stat-info">
            <h3>{dashboardStats.googleUsers || 0}</h3>
            <p>Google Users</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <FaUsers className="tab-icon" />
          Users ({users.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          <FaTicketAlt className="tab-icon" />
          Bookings ({bookings.length})
        </button>
      </div>

      {/* Users Table */}
      {activeTab === 'users' && (
        <div className="users-section">
          <div className="section-header">
            <h2>All Users ({users.length})</h2>
            <div className="quick-stats">
              <span>Recent Logins (24h): {dashboardStats.recentLogins || 0}</span>
              <span>New Registrations (7d): {dashboardStats.recentRegistrations || 0}</span>
            </div>
          </div>

          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Login Type</th>
                  <th>Last Login</th>
                  <th>Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="user-info">
                        <span className="user-name">{user.name}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user._id, e.target.value)}
                        className={`role-select ${user.role}`}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <span className={`status ${user.isActive ? 'active' : 'inactive'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <span className={`login-type ${user.googleId ? 'google' : 'email'}`}>
                        {user.googleId ? (
                          <>
                            <FaGoogle /> Google
                          </>
                        ) : (
                          'Email'
                        )}
                      </span>
                    </td>
                    <td>{formatDate(user.lastLogin)}</td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => toggleUserStatus(user._id)}
                          className={`action-btn ${user.isActive ? 'deactivate' : 'activate'}`}
                          title={user.isActive ? 'Deactivate User' : 'Activate User'}
                        >
                          {user.isActive ? <FaToggleOn /> : <FaToggleOff />}
                        </button>
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="action-btn delete"
                          title="Delete User"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bookings Table */}
      {activeTab === 'bookings' && (
        <div className="bookings-section">
          <div className="section-header">
            <h2>All Bookings ({bookings.length})</h2>
            <div className="quick-stats">
              <span>Recent Bookings (24h): {dashboardStats.recentBookings || 0}</span>
            </div>
          </div>

          <div className="bookings-table-container">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>User</th>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Attendees</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Booked On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>
                      <span className="booking-id">#{booking._id.slice(-8)}</span>
                    </td>
                    <td>
                      <div className="user-info">
                        <span className="user-name">{booking.user?.name || 'Unknown'}</span>
                        <span className="user-email">{booking.user?.email || 'N/A'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="event-info">
                        <span className="event-title">{booking.event?.title || 'Event Deleted'}</span>
                        <span className="event-location">{booking.event?.location || 'N/A'}</span>
                      </div>
                    </td>
                    <td>
                      <span className="event-date">
                        {booking.event?.date ? formatDate(booking.event.date) : 'N/A'}
                      </span>
                    </td>
                    <td>
                      <span className="attendees-count">{booking.attendees}</span>
                    </td>
                    <td>
                      <span className="total-amount">
                        ${((booking.event?.price || 0) * booking.attendees).toFixed(2)}
                      </span>
                    </td>
                    <td>
                      <span className={`booking-status ${booking.status || 'confirmed'}`}>
                        {booking.status || 'Confirmed'}
                      </span>
                    </td>
                    <td>{formatDate(booking.createdAt)}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn view"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
