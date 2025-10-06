import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [adminOnly]);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          'x-auth-token': token
        }
      };

      // Use admin endpoint if admin access required
      const endpoint = adminOnly ? '/api/admin/dashboard' : '/api/auth/me';
      const res = await axios.get(endpoint, config);
      
      if (adminOnly) {
        // If admin endpoint succeeds, user is admin
        setAuthorized(true);
      } else {
        // For regular protected routes, just check if user exists
        setUser(res.data);
        setAuthorized(true);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      
      // Check if it's a network error (server not running)
      if (!err.response) {
        console.error('Network error - server may not be running');
        toast.error('Cannot connect to server. Please make sure the server is running.');
        setLoading(false);
        return;
      }
      
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      if (adminOnly && err.response?.status === 403) {
        toast.error('Access denied. Admin privileges required.');
      } else if (err.response?.status === 401) {
        console.log('Token invalid, removing from localStorage');
        localStorage.removeItem('token');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Checking authorization...
      </div>
    );
  }

  if (!authorized) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
