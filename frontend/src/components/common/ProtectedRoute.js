// src/components/common/ProtectedRoute.js
import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { currentUser, loading, fetchUserProfile } = useContext(AuthContext);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      // If already loaded from context and authorized, don't reverify
      if (!loading && currentUser) {
        if (allowedRoles.length === 0 || allowedRoles.includes(currentUser.role)) {
          setIsAuthorized(true);
          setIsVerifying(false);
          return;
        }
      }
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsVerifying(false);
        return;
      }
      
      try {
        // Call the backend to verify the token and get user info
        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('User profile response:', response.data);
        
        // Check if user has required role (if roles are specified)
        if (allowedRoles.length === 0 || allowedRoles.includes(response.data.role)) {
          setIsAuthorized(true);
          
          // Update context with latest user data
          if (fetchUserProfile) {
            fetchUserProfile(token);
          }
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        // Clear invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
      } finally {
        setIsVerifying(false);
      }
    };
    
    verifyUser();
  }, [currentUser, loading, allowedRoles, fetchUserProfile]);

  if (loading || isVerifying) {
    // Show loading indicator while checking authentication
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    // Redirect to login if not authenticated or not authorized
    return <Navigate to="/login-sp" replace />;
  }

  // If authenticated and has the required role, render the protected component
  return children;
};

export default ProtectedRoute;