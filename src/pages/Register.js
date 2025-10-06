import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosConfig';
import './Form.css'; // Import the shared CSS file

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { name, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Frontend validation
    if (!name || !email || !password || !confirmPassword) {
      return toast.error('Please fill in all fields');
    }
    
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    
    if (password.length < 6) {
      return toast.error('Password should be at least 6 characters');
    }

    setLoading(true);
    
    try {
      console.log('Sending registration request...');
      
      const body = { name, email, password };
      console.log('Request body:', { name, email, password: '***' });
      
      const res = await axiosInstance.post('/api/auth/register', body);
      
      console.log('Registration response:', res.data);
      
      // Store token
      localStorage.setItem('token', res.data.token);
      
      // Store user data if needed
      if (res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
      
      toast.success('Registration successful!');
      navigate('/events');
      
    } catch (err) {
      console.error('Registration error:', err);
      
      // Handle network errors specifically
      if (err.code === 'ERR_NETWORK' || !err.response) {
        toast.error('Network Error: Cannot connect to server. Please check if the backend is running on port 5001.');
        return;
      }
      
      const errorMsg = err.response?.data?.msg || 
                      err.response?.data?.error || 
                      err.message || 
                      'Registration failed';
      
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="form-page-container">
      <div className="form-wrapper">
        <div className="form-header">
          <h2 className="title">Create your account</h2>
          <p className="subtitle">
            Or{' '}
            <Link to="/login">sign in to your existing account</Link>
          </p>
        </div>
        
        <button onClick={handleGoogleRegister} className="social-login-button">
          <FaGoogle className="icon" />
          <span>Sign up with Google</span>
        </button>
        
        <div className="divider">
          <div className="line"></div>
          <div className="text"><span>Or register with email</span></div>
        </div>
        
        <form className="form-content" onSubmit={handleSubmit}>
          <div className="input-group">
            <FaUser className="icon" />
            <input
              id="name"
              name="name"
              type="text"
              required
              className="input-field"
              placeholder="Full Name"
              value={name}
              onChange={handleChange}
            />
          </div>

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
              autoComplete="new-password"
              required
              className="input-field"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <FaLock className="icon" />
            <input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              className="input-field"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
          
          <div className="form-footer">
            <span>Already have an account? </span>
            <Link to="/login">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
