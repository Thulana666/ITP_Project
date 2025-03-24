import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  
  const { error } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true);
    setFormError('');

    // Basic validation
    if (!formData.email || !formData.password) {
      setFormError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password
      });

      console.log('Login response:', response.data);

      // Check if user needs to verify email
      if (response.data.needsVerification) {
        navigate('/verify-email-sp', { 
          state: { email: formData.email }
        });
        return;
      }

      // Check if user needs to provide 2FA
      if (response.data.require2FA) {
        navigate('/verify-otp', { 
          state: { email: formData.email }
        });
        return;
      }

      // Normal login success - Save token BEFORE any other operations
      localStorage.setItem('token', response.data.token);
      
      console.log('Token saved, redirecting to dashboard for service provider');
      
      // For service providers, navigate directly to dashboard 
      if (response.data.user && response.data.user.role === 'service_provider') {
        // Save user data in localStorage for persistence
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        navigate('/dashboard-sp');
        return;
      }
      
      // For other roles, fetch profile data first
      try {
        const userResponse = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${response.data.token}`
          }
        });
        
        console.log('User data response:', userResponse.data);
        
        // Save user data
        localStorage.setItem('currentUser', JSON.stringify(userResponse.data));
        
        // Redirect based on role
        if (userResponse.data.role === 'service_provider') {
          navigate('/dashboard-sp');
        } else if (userResponse.data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } catch (userErr) {
        console.error('Error fetching user data:', userErr);
        // If we can't fetch user data but we have user info from login response, use that
        if (response.data.user) {
          localStorage.setItem('currentUser', JSON.stringify(response.data.user));
          
          if (response.data.user.role === 'service_provider') {
            navigate('/dashboard-sp');
          } else {
            navigate('/');
          }
        } else {
          // Fallback to dashboard if we can't determine role
          navigate('/dashboard-sp');
        }
      }
      
    } catch (err) {
      console.error("Login error:", err);
      setFormError(err.response?.data?.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2><center>Service Provider Login</center></h2>
        <br></br>
        <p className="auth-subtitle">Access your service provider dashboard</p>
        
        {formError && <div className="error-message">{formError}</div>}
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Don't have a service provider account? <Link to="/register-sp">Register as Service Provider</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;