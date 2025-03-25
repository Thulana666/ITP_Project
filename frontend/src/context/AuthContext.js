// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in (token exists)
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('currentUser');
    
    if (token) {
      if (storedUser) {
        // If we have stored user data, use that immediately to prevent loading state
        try {
          setCurrentUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Error parsing stored user data:", e);
        }
      }
      
      // Then fetch fresh data from the server
      fetchUserProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      // Call the API to get current user data
      const response = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update currentUser state with fresh data
      setCurrentUser(response.data);
      
      // Also update localStorage
      localStorage.setItem('currentUser', JSON.stringify(response.data));
    } catch (error) {
      console.error("Error fetching user profile:", error);
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      
      // Make a real login request to your backend
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      
      // Store the token from the response
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        
        // If user info is included in the response, store it
        if (response.data.user) {
          localStorage.setItem('currentUser', JSON.stringify(response.data.user));
          setCurrentUser(response.data.user);
          return { success: true, user: response.data.user };
        }
        
        // Otherwise fetch user profile
        await fetchUserProfile(response.data.token);
        return { success: true };
      } else {
        throw new Error('Login failed - no token received');
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || 'An error occurred during login');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      // Make a real register request to your backend
      const response = await axios.post('http://localhost:5000/api/auth/register', userData);
      
      // Return success if registration is successful
      if (response.status === 201) {
        return { success: true, data: response.data };
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.response?.data?.message || 'Registration failed');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      loading, 
      error, 
      login, 
      register, 
      logout,
      fetchUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};