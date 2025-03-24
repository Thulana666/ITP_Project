// src/components/packages/PackageList.js
import React, { useState } from 'react';
import axios from 'axios';
import { formatCurrency } from '../../utils/formatters';
import './PackageList.css';

const PackageList = ({ packages, onEdit, onDelete }) => {
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleEdit = (pkg) => {
    onEdit(pkg);
  };

  const initiateDelete = (packageId) => {
    setDeletingId(packageId);
    setConfirmDelete(true);
    setDeleteError('');
  };

  const cancelDelete = () => {
    setDeletingId(null);
    setConfirmDelete(false);
  };

  const confirmDeletePackage = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/packages/${deletingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      onDelete(deletingId);
      setConfirmDelete(false);
      setDeletingId(null);
    } catch (err) {
      console.error('Error deleting package:', err);
      setDeleteError(err.response?.data?.message || 'Failed to delete package. Please try again.');
    }
  };

  if (packages.length === 0) {
    return (
      <div className="no-packages">
        <p>You haven't created any packages yet. Use the form above to create your first package.</p>
      </div>
    );
  }

  return (
    <div className="package-list">
      {deleteError && <div className="error-message">{deleteError}</div>}
      
      {confirmDelete && (
        <div className="delete-confirmation">
          <p>Are you sure you want to delete this package?</p>
          <div className="confirmation-buttons">
            <button className="btn-danger" onClick={confirmDeletePackage}>
              Yes, Delete
            </button>
            <button className="btn-secondary" onClick={cancelDelete}>
              Cancel
            </button>
          </div>
        </div>
      )}
      
      <div className="packages-grid">
        {packages.map(pkg => (
          <div key={pkg._id} className="package-card">
            <div className="package-header">
              <h3>{pkg.packageName}</h3>
              <span className="price">{formatCurrency(pkg.price)}</span>
            </div>
            
            <div className="package-description">
              <p>{pkg.description}</p>
            </div>
            
            {pkg.discount > 0 && (
              <div className="discount-badge">
                {pkg.discount}% OFF
              </div>
            )}
            
            <div className="package-actions">
              <button 
                className="btn-edit" 
                onClick={() => handleEdit(pkg)}
              >
                Edit
              </button>
              <button 
                className="btn-delete" 
                onClick={() => initiateDelete(pkg._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackageList;