import React, { useState } from "react";
import axios from "axios";

const UpdatePackageForm = ({ packageData, setEditingPackage, setPackages }) => {
  const [formData, setFormData] = useState(packageData);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/packages/${formData._id}`, formData)
      .then(response => {
        setPackages(prev => prev.map(pkg => pkg._id === response.data._id ? response.data : pkg));
        setEditingPackage(null);
      })
      .catch(error => console.error("Error updating package:", error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="packageName" value={formData.packageName} onChange={handleChange} required />
      <input type="text" name="description" value={formData.description} onChange={handleChange} required />
      <input type="number" name="price" value={formData.price} onChange={handleChange} required />
      <input type="text" name="serviceProvider" value={formData.serviceProvider} onChange={handleChange} required />
      <button type="submit">Update Package</button>
      <button onClick={() => setEditingPackage(null)}>Cancel</button>
    </form>
  );
};

export default UpdatePackageForm;
