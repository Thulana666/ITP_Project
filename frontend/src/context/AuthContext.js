// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCurrentUser(response.data);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCurrentUser(response.data);
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
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        if (response.data.user) {
          localStorage.setItem('currentUser', JSON.stringify(response.data.user));
          setCurrentUser(response.data.user);
          return { success: true, user: response.data.user };
        }
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
      const response = await axios.post('http://localhost:5000/api/auth/register', userData);
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

  const value = {
    currentUser,
    setCurrentUser,
    loading,
    error,
    login,
    register,
    logout,
    fetchUserProfile,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};