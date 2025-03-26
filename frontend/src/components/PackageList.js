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

  return (
    <div className="container">
      <h1>Package List</h1>
      {error && <div className="error-message">{error}</div>}
      <button className="globalButton" onClick={() => setShowAddForm(!showAddForm)}>
        {showAddForm ? 'Hide Add Form' : 'Add New Package'}
      </button>
      
      {showAddForm && <PackageForm setPackages={setPackages} />}
      {editingPackage && <UpdatePackageForm 
        packageData={editingPackage} 
        setEditingPackage={setEditingPackage} 
        setPackages={setPackages} 
      />}
      
      <div className="package-list">
        {packages.map(pkg => (
          <div key={pkg._id} className="package-card">
            <h2>{pkg.packageName}</h2>
            <p>{pkg.description}</p>
            <p>Price: {pkg.price}</p>
            <p>Service Provider: {pkg.serviceProvider}</p>
            {/*<button className="globalButton" onClick={() => setEditingPackage(pkg)}>Edit</button>*/}
            <button className="globalButton" onClick={() => handleDelete(pkg._id)}>Delete</button>
          </div>
        ))}
      </div>
      <ReportPage />
    </div>
  );
};

export default PackageList;
