import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Format currency
const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return 'LKR 0.00';
  
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

const ServiceProviderDashboard = () => {
  const { currentUser, loading, logout } = useContext(AuthContext);
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [packageData, setPackageData] = useState({
    packageName: '',
    description: '',
    price: '',
    serviceProvider: '',
    discount: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not a service provider
    if (!loading && (!currentUser || currentUser.role !== 'service_provider')) {
      navigate('/login');
    }
  }, [currentUser, loading, navigate]);

  useEffect(() => {
    if (currentUser) {
      fetchProviderPackages();
    }
  }, [currentUser]);

  const fetchProviderPackages = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Use the endpoint specifically for provider packages
      const response = await axios.get('http://localhost:5000/api/packages/provider', {
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      });
      
      console.log('Provider packages response:', response.data);
      setPackages(response.data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching provider packages:', err);
      setError('Failed to load your packages: ' + (err.response?.data?.message || err.message));
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPackageData({
      ...packageData,
      [name]: name === 'price' || name === 'discount' ? (value === '' ? '' : Number(value)) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Prepare the package data
      const dataToSend = {
        ...packageData,
        serviceProvider: packageData.serviceProvider || currentUser.serviceType
      };

      console.log('Sending package data:', dataToSend);
      
      if (isEditing) {
        // Update existing package
        await axios.put(
          `http://localhost:5000/api/packages/${editId}`, 
          dataToSend, 
          {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log('Package updated successfully');
      } else {
        // Create new package
        await axios.post(
          'http://localhost:5000/api/packages', 
          dataToSend, 
          {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log('Package created successfully');
      }
      
      // Reset form
      setPackageData({
        packageName: '',
        description: '',
        price: '',
        serviceProvider: currentUser?.serviceType || '',
        discount: 0
      });
      
      setIsEditing(false);
      setEditId(null);
      
      // Clear any previous errors
      setError(null);
      
      // Refresh packages
      fetchProviderPackages();
      
    } catch (err) {
      console.error('Error saving package:', err);
      setError('Failed to save package: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (pkg) => {
    setIsEditing(true);
    setEditId(pkg._id);
    setPackageData({
      packageName: pkg.packageName,
      description: pkg.description,
      price: pkg.price,
      serviceProvider: pkg.serviceProvider,
      discount: pkg.discount || 0
    });
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      await axios.delete(`http://localhost:5000/api/packages/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Refresh data after delete
      fetchProviderPackages();
    } catch (err) {
      console.error('Error deleting package:', err);
      setError('Failed to delete package: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading || isLoading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px' }}>Service Provider Dashboard</h1>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>
            {currentUser?.fullName} - {currentUser?.serviceType || 'Service Provider'}
          </p>
        </div>
        <div>
          <button 
            onClick={handleLogout}
            style={{
              backgroundColor: '#f5f5f5',
              color: '#333',
              border: '1px solid #ddd',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>
      
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
      }}>
        <h2>{isEditing ? 'Edit Package' : 'Create New Package'}</h2>
        {error && <div style={{ color: 'red', marginBottom: '10px', padding: '10px', backgroundColor: '#ffebee', borderRadius: '4px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Package Name</label>
            <input
              type="text"
              name="packageName"
              value={packageData.packageName}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              required
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Description</label>
            <textarea
              name="description"
              value={packageData.description}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', minHeight: '100px' }}
              required
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Price (LKR)</label>
            <input
              type="number"
              name="price"
              value={packageData.price}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              required
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Service Provider Type</label>
            <select
              name="serviceProvider"
              value={packageData.serviceProvider || currentUser?.serviceType || ''}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              required
            >
              <option value="">Select Service Type</option>
              <option value="Photographer">Photographer</option>
              <option value="Hotel">Hotel</option>
              <option value="Music Band">Music Band</option>
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Discount (%)</label>
            <input
              type="number"
              name="discount"
              value={packageData.discount}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              min="0"
              max="100"
            />
          </div>
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              type="submit"
              style={{
                backgroundColor: '#0066cc',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {isEditing ? 'Update Package' : 'Create Package'}
            </button>
            
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditId(null);
                  setPackageData({
                    packageName: '',
                    description: '',
                    price: '',
                    serviceProvider: currentUser?.serviceType || '',
                    discount: 0
                  });
                }}
                style={{
                  backgroundColor: '#f5f5f5',
                  color: '#333',
                  border: '1px solid #ddd',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
      }}>
        <h2>Your Packages</h2>
        
        {packages.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
            You haven't created any packages yet. Use the form above to create your first package.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {packages.map(pkg => (
              <div key={pkg._id} style={{
                border: '1px solid #eee',
                borderRadius: '8px',
                padding: '15px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h3 style={{ margin: 0 }}>{pkg.packageName}</h3>
                  <div style={{ fontWeight: 'bold', color: '#0066cc' }}>{formatCurrency(pkg.price)}</div>
                </div>
                
                <p style={{ color: '#666', marginBottom: '15px' }}>{pkg.description}</p>
                
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                  Service Type: <span style={{ fontWeight: '500' }}>{pkg.serviceProvider}</span>
                </div>
                
                {pkg.discount > 0 && (
                  <div style={{
                    display: 'inline-block',
                    backgroundColor: '#f44336',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    marginBottom: '10px'
                  }}>
                    {pkg.discount}% OFF
                  </div>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                  <button
                    onClick={() => handleEdit(pkg)}
                    style={{
                      backgroundColor: '#e3f2fd',
                      color: '#0066cc',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>
                  
                  <button
                    onClick={() => handleDelete(pkg._id)}
                    style={{
                      backgroundColor: '#ffebee',
                      color: '#d32f2f',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceProviderDashboard;