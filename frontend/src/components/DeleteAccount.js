// DeleteAccount.js

import React from 'react';
import axios from 'axios';

const DeleteAccount = () => {
  const handleDelete = async () => {
    // First confirmation dialog
    const firstConfirmation = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (firstConfirmation) {
      // Second confirmation dialog
      const secondConfirmation = window.confirm(
        "Are you absolutely sure? Deleting your account will remove all your data."
      );

      if (secondConfirmation) {
        try {
          const token = localStorage.getItem('token');
          
          if (!token) {
            alert('You are not logged in. Please log in again.');
            return;
          }

          // Proceed with deletion if the second confirmation is also 'OK'
          const response = await axios.delete('http://localhost:5000/api/service-provider/profile', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          


          if (response.status === 200) {
            alert('Account deleted successfully');
            localStorage.removeItem('token');  // Remove token from localStorage after successful deletion
            window.location.href = '/login';  // Redirect to login page
          }
        } catch (error) {
          console.error('Error deleting account:', error);

          // Handle error response from backend
          const errorMessage = error.response ? error.response.data.message : 'An unexpected error occurred';
          alert(`Error: ${errorMessage}`);
        }
      } else {
        alert("Account deletion canceled.");
      }
    } else {
      alert("Account deletion canceled.");
    }
  };

  return (
    <div>
      <h2>Delete Account</h2>
      <p>Are you sure you want to delete your account? This action cannot be undone.</p>
      <button onClick={handleDelete} style={{ backgroundColor: 'red' }}>Delete Account</button>
    </div>
  );
};

export default DeleteAccount;
