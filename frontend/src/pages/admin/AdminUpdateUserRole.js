import React, { useState } from "react";
import axios from "axios";

const AdminUpdateUserRole = () => {
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");

  const updateUserRole = async () => {
    try {
      await axios.put(`/api/admin/update-role/${userId}`, { role });
      alert("User role updated!");
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  return (
    <div>
      <h2>Update User Role</h2>
      <input type="text" placeholder="User ID" onChange={(e) => setUserId(e.target.value)} />
      <select onChange={(e) => setRole(e.target.value)}>
        <option value="">Select Role</option>
        <option value="customer">Customer</option>
        <option value="service_provider">Service Provider</option>
        <option value="admin">Admin</option>
      </select>
      <button onClick={updateUserRole}>Update Role</button>
    </div>
  );
};

export default AdminUpdateUserRole;
