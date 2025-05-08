
import React from 'react';


const Sidebar = ({ setView }) => {
  console.log("Sidebar rendered"); // Debugging line

  return (
    <div className="sidebar">
      <ul>
        <li style={{ 
  backgroundColor: '#1c1c25',
  padding: '10px',
  margin: '5px 0',
  borderRadius: '5px',
  textAlign: 'center', 
  color: '#FFFFFF'
}} onClick={() => {
          console.log('View Profile clicked');
          setView('viewProfile');
        }}>View Profile</li>
        <li style={{ 
  backgroundColor: '#1c1c25',
  padding: '10px',
  margin: '5px 0',
  borderRadius: '5px',
  textAlign: 'center', 
  color: '#FFFFFF'
}}  onClick={() => {
          console.log('Update Profile clicked');
          setView('updateProfile');
        }}>Update Profile</li>
        <li style={{ 
  backgroundColor: '#1c1c25',
  padding: '10px',
  margin: '5px 0',
  borderRadius: '5px',
  textAlign: 'center', 
  color: '#FFFFFF'
}}  onClick={() => {
          console.log('Delete Account clicked');
          setView('deleteAccount');
        }}>Delete Account</li>
      </ul>
    </div>
  );
};

export default Sidebar;