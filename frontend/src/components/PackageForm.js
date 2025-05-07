import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const PackageForm = ({ setPackages = null }) => {
  const { currentUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    packageName: "",
    description: "",
    price: "",
    serviceProvider: currentUser?.fullName || "",
  });
  
  const [fieldErrors, setFieldErrors] = useState({
    packageName: "",
    description: "",
    price: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateField = (name, value) => {
    switch (name) {
      case "packageName":
        return !value.trim() ? "Package name is required" :
               value.length < 3 ? "Package name must be at least 3 characters" : "";
      case "description":
        return !value.trim() ? "Description is required" :
               value.length < 10 ? "Description must be at least 10 characters" : "";
      case "price":
        return !value ? "Price is required" :
               value <= 0 ? "Price must be greater than 0" : "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFieldErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate all fields
    const errors = {
      packageName: validateField("packageName", formData.packageName),
      description: validateField("description", formData.description),
      price: validateField("price", formData.price)
    };

    setFieldErrors(errors);

    // Check if there are any errors
    if (Object.values(errors).some(error => error)) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError("Please login first");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/packages",
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (setPackages) {
        setPackages(prev => [...prev, response.data]);
      }
      
      setFormData({
        packageName: "",
        description: "",
        price: "",
        serviceProvider: currentUser?.fullName || "",
      });
      setSuccess("Package created successfully!");
      alert("Package created successfully!");
    } catch (error) {
      setError(error.response?.data?.message || "Error creating package");
      console.error("Error adding package:", error);
      alert("Error creating package");
    }
  };

  return (
    <div id="edit-packages">
      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        <div className="form-group">
          <input 
            type="text" 
            name="packageName" 
            value={formData.packageName}
            placeholder="Package Name" 
            onChange={handleChange} 
            required 
          />
          {fieldErrors.packageName && 
            <div className="error-message">{fieldErrors.packageName}</div>}
        </div>

        <div className="form-group">
          <input 
            type="text" 
            name="description" 
            value={formData.description}
            placeholder="Description" 
            onChange={handleChange} 
            required 
          />
          {fieldErrors.description && 
            <div className="error-message">{fieldErrors.description}</div>}
        </div>

        <div className="form-group">
          <input 
            type="number" 
            name="price" 
            value={formData.price}
            placeholder="Price" 
            onChange={handleChange} 
            min="0"
            step="0.01"
            required 
          />
          {fieldErrors.price && 
            <div className="error-message">{fieldErrors.price}</div>}
        </div>

        <input 
          type="text" 
          name="serviceProvider" 
          value={currentUser?.fullName || ""} 
          placeholder="Service Provider Name" 
          readOnly
          disabled
          hidden
        />
        <button 
          className="globalButton" 
          type="submit"
          disabled={Object.values(fieldErrors).some(error => error)}
        >
          Add Package
        </button>
      </form>
    </div>
  );
};

export default PackageForm;
