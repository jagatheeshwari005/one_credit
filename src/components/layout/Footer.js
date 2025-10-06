import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; // Import the CSS file

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-brand">
            <h3 className="title">Event Manager</h3>
            <p className="subtitle">Your one-stop solution for managing events.</p>
          </div>
          
          <div className="footer-links">
            <div className="column">
              <h4 className="heading">Quick Links</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/events">Events</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Sign Up</Link></li>
              </ul>
            </div>
            
            <div className="column">
              <h4 className="heading">Contact</h4>
              <ul>
                <li><span>Email: info@eventmanager.com</span></li>
                <li><span>Phone: (123) 456-7890</span></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Event Manager. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
