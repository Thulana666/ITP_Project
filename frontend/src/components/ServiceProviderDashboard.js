import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar'; // Ensure Sidebar is correctly imported
import ProfileView from './ProfileView';
import ProfileUpdate from './ProfileUpdate';
import DeleteAccount from './DeleteAccount';

const ServiceProviderDashboard = () => {
  const [view, setView] = useState('viewProfile'); // Default to 'viewProfile'
  const navigate = useNavigate();

  console.log("ServiceProviderDashboard rendered"); // Debugging line

  return (
    <div className="service-provider-dashboard"> {/* Add a custom class here */}
      <Sidebar setView={setView} />
      
      <div className="content">
      
        {/* Add this button before viewProfile */}
        <button 
          onClick={() => navigate('/service-provider/notifications')}
          style={{
            backgroundColor: '#2196f3',
            color: 'white',
            padding: '12px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginBottom: '10px',
            width: '100%'
          }}
        >
          Notifications
        </button>
        
        {/* Dynamically render the views based on the current view */}
        
        {view === 'viewProfile' && <ProfileView />}
        {view === 'updateProfile' && <ProfileUpdate />}
        {view === 'deleteAccount' && <DeleteAccount />}
        <button onClick={() => navigate('/add-package')}>
          Add Package
        </button>
        <button onClick={() => navigate('/service-provider/packages')}>
          Manage Packages
        </button>
        
      </div>
    </div>
  );
};

export default ServiceProviderDashboard;
