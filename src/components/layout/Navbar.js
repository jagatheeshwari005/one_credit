import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaUserShield, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import ThemeToggle from '../ThemeToggle';
import axios from 'axios';
import './Navbar.css'; // Import the CSS file

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { getCartItemCount, cartItems } = useCart();
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token');

  useEffect(() => {
    checkAdminStatus();
  }, [isAuthenticated]);

  const checkAdminStatus = async () => {
    if (!isAuthenticated) {
      setIsAdmin(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };

      await axios.get('/api/admin/dashboard', config);
      setIsAdmin(true);
    } catch (err) {
      setIsAdmin(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    setMobileMenuOpen(false); // Close menu on logout
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <FaCalendarAlt className="icon" />
          <span className="title">Event Manager</span>
        </Link>

        {/* Desktop Menu */}
        <div className="nav-menu">
          <Link to="/">Home</Link>
          <Link to="/events">Events</Link>
          {isAuthenticated && (
            <>
              <Link to="/create-event" className="nav-link">
                Create Event
              </Link>
              <Link to="/my-bookings" className="nav-link">
                My Bookings
              </Link>
              <Link to="/cart" className="nav-link">
                <FaShoppingCart />
                Cart ({cartItems.length})
              </Link>
            </>
          )}
          {isAdmin && (
            <Link to="/admin" className="admin-link">
              <FaUserShield /> Admin
            </Link>
          )}
          <div className="nav-actions">
            <ThemeToggle />
            {isAuthenticated ? (
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register" className="signup-button">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-button" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? '\u2715' : '\u2630'} {/* Show 'X' or '☰' */}
        </button>
      </div>

      {/* Mobile Menu (conditionally rendered) */}
      {isMobileMenuOpen && (
        <div className="nav-menu-mobile">
          <Link to="/" onClick={closeMobileMenu}>Home</Link>
          <Link to="/events" onClick={closeMobileMenu}>Events</Link>
          {isAuthenticated && (
            <>
              <Link to="/create-event" onClick={closeMobileMenu}>Create Event</Link>
              <Link to="/my-bookings" onClick={closeMobileMenu}>My Bookings</Link>
              <Link to="/cart" className="cart-link" onClick={closeMobileMenu}>
                <FaShoppingCart /> Cart
                {getCartItemCount() > 0 && (
                  <span className="cart-badge">{getCartItemCount()}</span>
                )}
              </Link>
            </>
          )}
          {isAdmin && (
            <Link to="/admin" className="admin-link" onClick={closeMobileMenu}>
              <FaUserShield /> Admin
            </Link>
          )}
          <div className="nav-actions">
            <ThemeToggle />
            {isAuthenticated ? (
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" onClick={closeMobileMenu}>Login</Link>
                <Link to="/register" className="signup-button" onClick={closeMobileMenu}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
