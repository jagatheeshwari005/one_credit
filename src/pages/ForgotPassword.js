import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import './Form.css'; // Reuse the shared form styles

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      return toast.error('Please enter your email address');
    }

    setLoading(true);
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const body = JSON.stringify({ email });
      
      // This endpoint needs to be created on the backend
      await axios.post('/api/auth/forgot-password', body, config);
      
      toast.success('Password reset link sent! Please check your email.');
    } catch (err) {
      const error = err.response?.data?.msg || 'Failed to send reset link';
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page-container">
      <div className="form-wrapper">
        <div className="form-header">
          <h2 className="title">Forgot Your Password?</h2>
          <p className="subtitle">
            No problem. Enter your email below and we'll send you a reset link.
          </p>
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
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
          
          <div className="form-footer">
            <Link to="/login">Back to Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
