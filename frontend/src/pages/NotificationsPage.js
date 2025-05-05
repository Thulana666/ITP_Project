import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/notifications', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Sort notifications by date, newest first
        const sortedNotifications = response.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );

        setNotifications(sortedNotifications);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('Failed to load notifications');
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/notifications/${notificationId}/read`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Update local state
      setNotifications(notifications.map(notif => 
        notif._id === notificationId ? { ...notif, isRead: true } : notif
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  if (loading) return <div>Loading notifications...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Notifications</h1>
      
      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {notifications.map(notification => (
            <div
              key={notification._id}
              style={{
                padding: '15px',
                backgroundColor: notification.isRead ? 'white' : '#e3f2fd',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                borderLeft: `4px solid ${notification.isRead ? '#90caf9' : '#2196f3'}`,
                cursor: 'pointer'
              }}
              onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '10px' 
              }}>
                <h3 style={{ margin: 0, color: '#1976d2' }}>{notification.title}</h3>
                <span style={{ color: '#666', fontSize: '0.9em' }}>
                  {new Date(notification.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div style={{ color: '#666' }}>
                <p style={{ margin: '5px 0' }}>{notification.message}</p>
                {notification.type === 'booking' && (
                  <p style={{ margin: '5px 0', fontSize: '0.9em' }}>
                    <strong>Type:</strong> {notification.type}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
