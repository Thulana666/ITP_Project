import React, { useState } from 'react';
import Sidebar from './Sidebar'; // Ensure Sidebar is correctly imported
import ProfileView from './ProfileView';
import ProfileUpdate from './ProfileUpdate';
import DeleteAccount from './DeleteAccount';

const ServiceProviderDashboard = () => {
  const [view, setView] = useState('viewProfile'); // Default to 'viewProfile'

  const handleClick = (path) => {
    window.location.href = path;
  };

  console.log("ServiceProviderDashboard rendered"); // Debugging line

  return (
    <div className="service-provider-dashboard"> {/* Add a custom class here */}
      <Sidebar setView={setView} />
      
      <div className="content">
      
        {/* Dynamically render the views based on the current view */}
        
        {view === 'viewProfile' && <ProfileView />}
        {view === 'updateProfile' && <ProfileUpdate />}
        {view === 'deleteAccount' && <DeleteAccount />}

        <button onClick={() => handleClick('/add-package')}>
          Add New Package
        </button>
        <button onClick={() => handleClick('/package-list')}>
          View/Edit/Delete Packages
        </button>
        
      </div>
    </div>
  );
};

export default ServiceProviderDashboard;
