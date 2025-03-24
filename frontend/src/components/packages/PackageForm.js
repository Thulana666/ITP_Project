// src/components/packages/PackageForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PackageForm = ({ initialData, onPackageCreated, onPackageUpdated, onCancel, serviceProvider }) => {
  const [formData, setFormData] = useState({
    packageName: '',
    description: '',
    price: '',
    serviceProvider: serviceProvider || '',
    discount: 0
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // If initialData is provided, we're in edit mode
    if (initialData) {
      setFormData({
        packageName: initialData.packageName,
        description: initialData.description,
        price: initialData.price,
        serviceProvider: initialData.serviceProvider,
        discount: initialData.discount || 0
      });
    } else {
      // In create mode, use the provided serviceProvider
      setFormData(prev => ({
        ...prev,
        serviceProvider: serviceProvider || ''
      }));
    }
  }, [initialData, serviceProvider]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'discount' ? 
        (value === '' ? '' : Number(value)) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.packageName || !formData.description || formData.price === '' || !formData.serviceProvider) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    try {
      if (initialData) {
        // Update existing package
        const response = await axios.put(
          `http://localhost:5000/api/packages/${initialData._id}`,
          formData,
          config
        );
        onPackageUpdated(response.data);
      } else {
        // Create new package
        const response = await axios.post(
          'http://localhost:5000/api/packages',
          formData,
          config
        );
        onPackageCreated(response.data);
        
        // Reset form after creation
        setFormData({
          packageName: '',
          description: '',
          price: '',
          serviceProvider: serviceProvider || '',
          discount: 0
        });
      }
    } catch (err) {
      console.error('Error saving package:', err);
      setError(err.response?.data?.message || 'Failed to save package. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="package-form-container">
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="package-form">
        <div className="form-group">
          <label htmlFor="packageName">Package Name</label>
          <input
            type="text"
            id="packageName"
            name="packageName"
            value={formData.packageName}
            onChange={handleChange}
            placeholder="Enter package name"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter package description"
            rows="4"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="price">Price (LKR)</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter price"
            min="0"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="serviceProvider">Service Provider Type</label>
          <input
            type="text"
            id="serviceProvider"
            name="serviceProvider"
            value={formData.serviceProvider}
            onChange={handleChange}
            placeholder="Type of service provider"
            required
            readOnly={!!serviceProvider} // Make it readonly if provided from parent
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="discount">Discount Percentage (%)</label>
          <input
            type="number"
            id="discount"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            placeholder="Enter discount percentage"
            min="0"
            max="100"
          />
        </div>
        
        <div className="form-buttons">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : initialData ? 'Update Package' : 'Create Package'}
          </button>
          
          {initialData && (
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PackageForm;