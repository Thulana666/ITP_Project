import React, { useState } from "react";
import axios from "axios";

const PackageForm = ({ setPackages }) => {
  const [formData, setFormData] = useState({
    packageName: "",
    description: "",
    price: "",
    serviceProvider: "",
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/packages", formData)
      .then(response => setPackages(prev => [...prev, response.data]))
      .catch(error => console.error("Error adding package:", error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="packageName" placeholder="Package Name" onChange={handleChange} required />
      <input type="text" name="description" placeholder="Description" onChange={handleChange} required />
      <input type="number" name="price" placeholder="Price" onChange={handleChange} required />
      <input type="text" name="serviceProvider" placeholder="Service Provider" onChange={handleChange} required />
      <button className="globalButton" type="submit">Add Package</button>
    </form>
  );
};

export default PackageForm;
