
import React from 'react';


const Sidebar = ({ setView }) => {
  console.log("Sidebar rendered"); // Debugging line

  return (
    <div className="sidebar">
      <ul>
        <li style={{ 
  backgroundColor: '#f0f0f0',
  padding: '10px',
  margin: '5px 0',
  borderRadius: '5px',
  textAlign: 'center', 
  color: '#000'
}} onClick={() => {
          console.log('View Profile clicked');
          setView('viewProfile');
        }}>View Profile</li>
        <li style={{ 
  backgroundColor: '#f0f0f0',
  padding: '10px',
  margin: '5px 0',
  borderRadius: '5px',
  textAlign: 'center', 
  color: '#000'
}}  onClick={() => {
          console.log('Update Profile clicked');
          setView('updateProfile');
        }}>Update Profile</li>
        <li style={{ 
  backgroundColor: '#f0f0f0',
  padding: '10px',
  margin: '5px 0',
  borderRadius: '5px',
  textAlign: 'center', 
  color: '#000'
}}  onClick={() => {
          console.log('Delete Account clicked');
          setView('deleteAccount');
        }}>Delete Account</li>
      </ul>
    </div>
  );
};

export default Sidebar;