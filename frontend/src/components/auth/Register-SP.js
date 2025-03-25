import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    serviceType: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const { error } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError('');
    setSuccessMessage('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (!formData.phoneNumber || !formData.serviceType) {
      setFormError('Phone number and service type are required for service providers');
      setLoading(false);
      return;
    }

    // Create user data object for API
    const userData = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      isServiceProvider: true,
      role: 'service_provider',
      phoneNumber: formData.phoneNumber,
      serviceType: formData.serviceType
    };

    try {
      // Use direct axios call instead of context to get full response
      const response = await axios.post('http://localhost:5000/api/auth/register', userData);
      
      setSuccessMessage(response.data.message || 'Registration successful!');
      
      // Navigate to email verification page with email in state
      setTimeout(() => {
        console.log('Redirecting to verification page with email:', formData.email);
        navigate('/verify-email-sp', { 
          state: { email: formData.email }
        });
      }, 1500);
      
    } catch (err) {
      setFormError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const serviceTypeOptions = [
    { value: '', label: 'Select Service Type' },
    { value: 'Photographer', label: 'Photographer' },
    { value: 'Hotel', label: 'Hotel' },
    { value: 'Music Band', label: 'Music Band' }
  ];

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2><center>Service Provider Registration</center></h2>
        <br></br>
        <p className="auth-subtitle">Create your service provider account</p>
        
        {formError && <div className="error-message">{formError}</div>}
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Business/Service Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your business or service name"
              required
            />
          </div>
          
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
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="serviceType">Service Type</label>
            <select
              id="serviceType"
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              required
            >
              {serviceTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
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
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Registering...' : 'Register as Service Provider'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Already have a service provider account? <Link to="/login-sp">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;