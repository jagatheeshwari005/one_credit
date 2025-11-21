import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshUser } = useAuth();

  useEffect(() => {
    (async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        toast.error('Authentication failed. Please try again.');
        navigate('/login');
        return;
      }

      if (token) {
        // Store the token in localStorage
        localStorage.setItem('token', token);
        // Try to refresh user info from backend so UI knows user/role
        try {
          await refreshUser();
        } catch (err) {
          console.error('Failed to refresh user after OAuth', err);
        }

        toast.success('Successfully signed in with Google!');
        // Redirect based on role
        const refreshed = await refreshUser();
        const role = refreshed?.role || 'user';
        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        toast.error('No authentication token received.');
        navigate('/login');
      }
    })();
  }, [navigate, searchParams]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '18px'
    }}>
      Processing authentication...
    </div>
  );
};

export default AuthSuccess;
