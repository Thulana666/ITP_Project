import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({ fullName: "", email: "", role: "" });

  // Fetch all users when component loads
  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to fetch all users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Function to handle user edit button click
  const handleEditClick = (user) => {
    setEditingUserId(user._id);
    setEditedUser({ fullName: user.fullName, email: user.email, role: user.role });
  };

  // Function to handle input change for editing
  const handleInputChange = (e) => {
    setEditedUser((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Function to save edited user data
  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/admin/update-user/${editingUserId}`,
        { 
          fullName: editedUser.fullName, 
          email: editedUser.email, 
          role: editedUser.role 
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchUsers(); // Refresh user list after update
      setEditingUserId(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Function to delete a user
  const handleDeleteUser = async (_id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/admin/delete-user/${_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        fetchUsers(); // Refresh the user list
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  // Filter users based on search input
  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px", backgroundColor: "#F9FAFB", borderRadius: "10px", maxWidth: "900px", margin: "auto" }}>
      <h2 style={{ fontSize: "2rem", color: "#2C3E50", marginBottom: "20px" }}>View All Users</h2>
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
          border: "2px solid #3498db",
          borderRadius: "5px",
          fontSize: "1rem",
          boxSizing: "border-box",
        }}
      />
      <ul style={{ listStyle: "none", padding: "0" }}>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <li
              key={user._id}
              style={{
                backgroundColor: "#ecf0f1",
                padding: "15px",
                margin: "10px 0",
                borderRadius: "5px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              {editingUserId === user._id ? (
                <>
                  <input
                    type="text"
                    name="fullName"
                    value={editedUser.fullName}
                    onChange={handleInputChange}
                    style={{
                      padding: "8px",
                      margin: "5px",
                      borderRadius: "5px",
                      border: "1px solid #3498db",
                    }}
                  />
                  <input
                    type="email"
                    name="email"
                    value={editedUser.email}
                    onChange={handleInputChange}
                    style={{
                      padding: "8px",
                      margin: "5px",
                      borderRadius: "5px",
                      border: "1px solid #3498db",
                    }}
                  />
                  <select
                    name="role"
                    value={editedUser.role}
                    onChange={handleInputChange}
                    style={{
                      padding: "8px",
                      margin: "5px",
                      borderRadius: "5px",
                      border: "1px solid #3498db",
                      backgroundColor: "#fff",
                    }}
                  >
                    <option value="customer">Customer</option>
                    <option value="service_provider">Service Provider</option>
                    <option value="admin">Admin</option>
                  </select>

                  <button
                    onClick={handleSaveEdit}
                    style={{
                      backgroundColor: "#2ecc71",
                      color: "white",
                      border: "none",
                      padding: "10px 15px",
                      borderRadius: "5px",
                      cursor: "pointer",
                      marginRight: "10px",
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingUserId(null)}
                    style={{
                      backgroundColor: "#e74c3c",
                      color: "white",
                      border: "none",
                      padding: "10px 15px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span style={{ color: "#34495e" }}>
                    {user.fullName} - {user.email} ({user.role})
                  </span>
                  <div>
                    <button
                      onClick={() => handleEditClick(user)}
                      style={{
                        backgroundColor: "#f39c12",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        marginRight: "10px",
                        transition: "background-color 0.3s",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      style={{
                        backgroundColor: "#e74c3c",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        transition: "background-color 0.3s",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))
        ) : (
          <li>No users found.</li>
        )}
      </ul>
    </div>
  );
};

export default AdminViewUsers;
