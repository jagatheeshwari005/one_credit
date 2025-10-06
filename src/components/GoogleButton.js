import React from 'react';
import { FaGoogle } from 'react-icons/fa';
import './GoogleButton.css';

const GoogleButton = ({ text = "Continue with Google" }) => {
  const handleGoogleAuth = () => {
    // Redirect to backend Google OAuth route
    window.location.href = '/api/auth/google';
  };

  return (
    <button 
      type="button" 
      className="google-button"
      onClick={handleGoogleAuth}
    >
      <FaGoogle className="google-icon" />
      <span>{text}</span>
    </button>
  );
};

export default GoogleButton;
