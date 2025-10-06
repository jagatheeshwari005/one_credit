import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaEnvelope, FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosConfig';
import './Form.css'; // Import the shared CSS file

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error('Please fill in all fields');
    }

    setLoading(true);

    try {
      console.log('Sending login request...');

      const res = await axiosInstance.post('/api/auth/login', { email, password });

      console.log('Login response:', res.data);

      // Store token
      localStorage.setItem('token', res.data.token);

      // Store user data if available
      if (res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }

      toast.success('Login successful!');
      navigate('/events');

    } catch (err) {
      console.error('Login error:', err);

      // Handle network errors specifically
      if (err.code === 'ERR_NETWORK' || !err.response) {
        toast.error('Network Error: Cannot connect to server. Please check if the backend is running on port 5000.');
        return;
      }

      const errorMsg = err.response?.data?.msg ||
        err.response?.data?.error ||
        err.message ||
        'Login failed';

      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="form-page-container">
      <div className="form-wrapper">
        <div className="form-header">
          <h2 className="title">Sign in to your account</h2>
          <p className="subtitle">
            Or{' '}
            <Link to="/register">create a new account</Link>
          </p>
        </div>

        <button onClick={handleGoogleLogin} className="social-login-button">
          <FaGoogle className="icon" />
          <span>Sign in with Google</span>
        </button>

        <div className="divider">
          <div className="line"></div>
          <div className="text"><span>Or continue with email</span></div>
        </div>

        <form className="form-content" onSubmit={handleSubmit}>
          <div className="input-group">
            <FaEnvelope className="icon" />
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="input-field"
              placeholder="Email address"
              value={email}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <FaLock className="icon" />
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="input-field"
              placeholder="Password"
              value={password}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <div className="remember-me">
              <input id="remember-me" name="remember-me" type="checkbox" />
              <label htmlFor="remember-me">Remember me</label>
            </div>
            <div className="forgot-password">
              <Link to="/forgot-password">Forgot your password?</Link>
            </div>
          </div>

          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="form-footer">
            <span>Don't have an account? </span>
            <Link to="/register">Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
