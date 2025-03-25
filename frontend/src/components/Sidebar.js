
import React from 'react';


const Sidebar = ({ setView }) => {
  console.log("Sidebar rendered"); // Debugging line

  return (
    <div className="sidebar">
      <ul>
        <li onClick={() => {
          console.log('View Profile clicked');
          setView('viewProfile');
        }}>View Profile</li>
        <li onClick={() => {
          console.log('Update Profile clicked');
          setView('updateProfile');
        }}>Update Profile</li>
        <li onClick={() => {
          console.log('Delete Account clicked');
          setView('deleteAccount');
        }}>Delete Account</li>
      </ul>
    </div>
  );
};

export default Sidebar;