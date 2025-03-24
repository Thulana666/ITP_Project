// src/components/ServiceProviderProfileModal.js
import React from 'react';

const ServiceProviderProfileModal = ({ provider, onClose }) => {
  if (!provider) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Service Package Details</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="profile-info">
            <div className="info-group">
              <label>Package Name:</label>
              <p>{provider.packageDetails?.name || provider.fullName}</p>
            </div>
            <div className="info-group">
              <label>Service Type:</label>
              <p>{provider.serviceType}</p>
            </div>
            
            {provider.packageDetails?.description && (
              <div className="info-group">
                <label>Description:</label>
                <p>{provider.packageDetails.description}</p>
              </div>
            )}
            
            {provider.packageDetails?.price && (
              <div className="info-group">
                <label>Price:</label>
                <p>{formatCurrency(provider.packageDetails.price)}</p>
              </div>
            )}
            
            {provider.packageDetails?.discount > 0 && (
              <div className="info-group">
                <label>Discount:</label>
                <p>{provider.packageDetails.discount}%</p>
              </div>
            )}
            
            <div className="contact-section">
              <h3>Contact Information</h3>
              <div className="info-group">
                <label>Email:</label>
                <p>{provider.email}</p>
              </div>
              <div className="info-group">
                <label>Phone:</label>
                <p>{provider.phoneNumber}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

// Helper function for currency formatting
const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return 'LKR 0.00';
  
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export default ServiceProviderProfileModal;