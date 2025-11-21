import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }
        // Verify token with backend and load full user
        const res = await axios.get('/api/auth/me', { headers: { 'x-auth-token': token } });
        setUser(res.data);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Auth check failed', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      const { token } = res.data;
      localStorage.setItem('token', token);
      // Load user info after setting token
      try {
        const me = await axios.get('/api/auth/me', { headers: { 'x-auth-token': token } });
        setUser(me.data);
        setIsAuthenticated(true);
        // persist user for quick reads by other modules
        localStorage.setItem('user', JSON.stringify(me.data));
        return { success: true, user: me.data };
      } catch (e) {
        // Fallback: set token-only user
        setUser({ token });
        setIsAuthenticated(true);
        return { success: true, user: { token } };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.response?.data?.msg || 'Login failed' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await axios.post('/api/auth/register', { name, email, password });
      const { token } = res.data;
      localStorage.setItem('token', token);
      try {
        const me = await axios.get('/api/auth/me', { headers: { 'x-auth-token': token } });
        setUser(me.data);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(me.data));
        return { success: true, user: me.data };
      } catch (e) {
        setUser({ token });
        setIsAuthenticated(true);
        return { success: true, user: { token } };
      }
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, error: error.response?.data?.msg || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  // Helper to refresh user info from backend (after OAuth redirect sets token)
  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const res = await axios.get('/api/auth/me', { headers: { 'x-auth-token': token } });
      setUser(res.data);
      setIsAuthenticated(true);
      return res.data;
    } catch (err) {
      console.error('Refresh user failed', err);
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        refreshUser
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
