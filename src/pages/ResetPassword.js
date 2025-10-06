import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import './Form.css'; // Reuse the shared form styles

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetToken } = useParams(); // Get the token from the URL
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters long');
    }

    setLoading(true);
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const body = JSON.stringify({ password });
      
      await axios.put(`/api/auth/reset-password/${resetToken}`, body, config);
      
      toast.success('Password has been reset successfully!');
      navigate('/login');
    } catch (err) {
      const error = err.response?.data?.msg || 'Failed to reset password';
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page-container">
      <div className="form-wrapper">
        <div className="form-header">
          <h2 className="title">Reset Your Password</h2>
          <p className="subtitle">Enter your new password below.</p>
        </div>
        
        <form className="form-content" onSubmit={handleSubmit}>
          <div className="input-group">
            <FaLock className="icon" />
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="input-field"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
