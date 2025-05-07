import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import PackageForm from "../components/PackageForm";
import axios from "axios";
import "../styles/styles.css";

const ServiceProviderPackages = () => {
  const { currentUser } = useContext(AuthContext);
  const [packages, setPackages] = useState([]);
  const [editingPackage, setEditingPackage] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({
    packageName: "",
    description: "",
    price: "",
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingPackage(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prevErrors => ({
      ...prevErrors,
      [name]: validateField(name, value)
    }));
  };

  const clearAllErrors = () => {
    setFieldErrors({
      packageName: "",
      description: "",
      price: "",
    });
  };

  useEffect(() => {
    fetchProviderPackages();
  }, []);

  const fetchProviderPackages = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError("Please login first");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/api/packages/provider", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setPackages(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching packages");
      console.error("Error fetching packages:", err);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError("Please login first");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/packages/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setPackages(packages.filter(pkg => pkg._id !== id));
    } catch (error) {
      console.error("Error deleting package:", error);
      setError(error.response?.data?.message || "Error deleting package");
    }
  };

  const handleUpdate = async (id, updatedData) => {
    const errors = {
      packageName: validateField("packageName", updatedData.packageName),
      description: validateField("description", updatedData.description),
      price: validateField("price", String(updatedData.price))
    };

    setFieldErrors(errors);

    if (Object.values(errors).some(error => error)) {
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      setError("Please login first");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/packages/${id}`,
        { ...updatedData, serviceProvider: currentUser.serviceType },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      setPackages(packages.map(pkg => 
        pkg._id === id ? response.data : pkg
      ));
      setEditingPackage(null);
      clearAllErrors();
    } catch (error) {
      console.error("Error updating package:", error);
      setError(error.response?.data?.message || "Error updating package");
    }
  };

  return (
    <div className="container" id="edit-packages">
      <h1>My Packages</h1>
      {error && <div className="error-message">{error}</div>}
      <button className="globalButton" onClick={() => setShowAddForm(!showAddForm)}>
        {showAddForm ? 'Hide Add Form' : 'Add New Package'}
      </button>
      
      {showAddForm && <PackageForm setPackages={setPackages} />}
      {editingPackage && (
        <div className="packages-edit-form-overlay">
          <div className="packages-edit-form">
            <h2>Edit Package</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={(e) => {
              e.preventDefault();
              handleUpdate(editingPackage._id, {
                packageName: editingPackage.packageName,
                description: editingPackage.description,
                price: Number(editingPackage.price)
              });
            }}>
              <input
                name="packageName"
                value={editingPackage.packageName}
                placeholder="Package Name"
                onChange={handleInputChange}
              />
              {fieldErrors.packageName && <div className="error-message">{fieldErrors.packageName}</div>}
              <textarea
                name="description"
                value={editingPackage.description}
                placeholder="Description"
                onChange={handleInputChange}
              />
              {fieldErrors.description && <div className="error-message">{fieldErrors.description}</div>}
              <input
                name="price"
                type="number"
                value={editingPackage.price}
                placeholder="Price"
                onChange={handleInputChange}
              />
              {fieldErrors.price && <div className="error-message">{fieldErrors.price}</div>}
              <input
                name="serviceProvider"
                value={currentUser.serviceType}
                disabled
                readOnly
              />
              <button type="submit" className="globalButton" disabled={Object.values(fieldErrors).some(error => error)}>Save Changes</button>
              <button type="button" className="globalButton" onClick={() => {
                setEditingPackage(null);
                clearAllErrors();
              }}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
      
      <div className="package-list">
        {packages.map(pkg => (
          <div key={pkg._id} className="package-card">
            <h2>{pkg.packageName}</h2>
            <p>{pkg.description}</p>
            <p>Price: LKR {pkg.price}</p>
            <button className="globalButton" onClick={() => setEditingPackage(pkg)}>Edit</button>
            <button className="globalButton" onClick={() => handleDelete(pkg._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceProviderPackages;
