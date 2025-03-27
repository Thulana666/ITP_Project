import React, { useState, useEffect } from "react";
import PackageForm from "./PackageForm";
import UpdatePackageForm from "./UpdatePackageForm";
import ReportPage from "./spReportPage";
import axios from "axios";
import "../styles/styles.css";

const PackageList = () => {
  const [packages, setPackages] = useState([]);
  const [editingPackage, setEditingPackage] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Please login first");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/packages", {
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

    fetchPackages();
  }, []);

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
    const token = localStorage.getItem('token');
    if (!token) {
      setError("Please login first");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/packages/${id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      setPackages(packages.map(pkg => 
        pkg._id === id ? response.data : pkg
      ));
      setEditingPackage(null); // Close the edit form
    } catch (error) {
      console.error("Error updating package:", error);
      setError(error.response?.data?.message || "Error updating package");
    }
  };

  return (
    <div className="container">
      <h1>Package List</h1>
      {error && <div className="error-message">{error}</div>}
      <button className="globalButton" onClick={() => setShowAddForm(!showAddForm)}>
        {showAddForm ? 'Hide Add Form' : 'Add New Package'}
      </button>
      
      {showAddForm && <PackageForm setPackages={setPackages} />}
      {editingPackage && (
        <div className="packages-edit-form-overlay">
          <div className="packages-edit-form">
            <h2>Edit Package</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleUpdate(editingPackage._id, {
                packageName: e.target.packageName.value,
                description: e.target.description.value,
                price: Number(e.target.price.value),
                serviceProvider: e.target.serviceProvider.value
              });
            }}>
              <input
                name="packageName"
                defaultValue={editingPackage.packageName}
                placeholder="Package Name"
              />
              <textarea
                name="description"
                defaultValue={editingPackage.description}
                placeholder="Description"
              />
              <input
                name="price"
                type="number"
                defaultValue={editingPackage.price}
                placeholder="Price"
              />
              <input
                name="serviceProvider"
                defaultValue={editingPackage.serviceProvider}
                placeholder="Service Provider"
              />
              <button type="submit" className="globalButton">Save Changes</button>
              <button type="button" className="globalButton" onClick={() => setEditingPackage(null)}>
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
            <p>Price: {pkg.price}</p>
            <p>Service Provider: {pkg.serviceProvider}</p>
            <button className="globalButton" onClick={() => setEditingPackage(pkg)}>Edit</button>
            <button className="globalButton" onClick={() => handleDelete(pkg._id)}>Delete</button>
          </div>
        ))}
      </div>
      <ReportPage />
    </div>
  );
};

export default PackageList;
