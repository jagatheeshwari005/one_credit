import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import Cart from './pages/Cart';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AuthSuccess from './pages/AuthSuccess';
import AdminDashboard from './pages/AdminDashboard';
import CreateEvent from './pages/CreateEvent';
import BookEvent from './pages/BookEvent';
import BookingConfirmation from './pages/BookingConfirmation';
import MyBookings from './pages/MyBookings';
import EventDetails from './pages/EventDetails';

function App() {
  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={
            <main className="flex-grow container mx-auto px-4 py-8">
              <Login />
            </main>
          } />
          <Route path="/register" element={
            <main className="flex-grow container mx-auto px-4 py-8">
              <Register />
            </main>
          } />
          <Route path="/events" element={
            <main className="flex-grow container mx-auto px-4 py-8">
              <Events />
            </main>
          } />
          <Route path="/event-details/:eventId" element={
            <main className="flex-grow container mx-auto px-4 py-8">
              <EventDetails />
            </main>
          } />
          <Route path="/cart" element={
            <main className="flex-grow container mx-auto px-4 py-8">
              <Cart />
            </main>
          } />
          <Route path="/forgot-password" element={
            <main className="flex-grow container mx-auto px-4 py-8">
              <ForgotPassword />
            </main>
          } />
          <Route path="/reset-password/:resetToken" element={
            <main className="flex-grow container mx-auto px-4 py-8">
              <ResetPassword />
            </main>
          } />
          <Route path="/auth/success" element={
            <main className="flex-grow container mx-auto px-4 py-8">
              <AuthSuccess />
            </main>
          } />
          <Route
            path="/create-event"
            element={
              <AdminRoute>
                <main className="flex-grow container mx-auto px-4 py-8">
                  <CreateEvent />
                </main>
              </AdminRoute>
            }
          />
          <Route
            path="/book-event/:eventId"
            element={
              <ProtectedRoute>
                <main className="flex-grow container mx-auto px-4 py-8">
                  <BookEvent />
                </main>
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking-confirmation/:bookingId"
            element={
              <ProtectedRoute>
                <main className="flex-grow container mx-auto px-4 py-8">
                  <BookingConfirmation />
                </main>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <main className="flex-grow container mx-auto px-4 py-8">
                  <MyBookings />
                </main>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute adminOnly={true}>
                <main className="flex-grow container mx-auto px-4 py-8">
                  <AdminDashboard />
                </main>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </ThemeProvider>
  );
}

export default App;
