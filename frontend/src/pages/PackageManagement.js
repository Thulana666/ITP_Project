import React, { useState, useEffect } from "react";
import PackageForm from "../components/PackageForm";  
import UpdatePackageForm from "../components/UpdatePackageForm";  
import ReportPage from "../components/spReportPage";  
import axios from "axios";
import "../styles/styles.css"; 

const PackageListPage = () => {
  const [packages, setPackages] = useState([]);
  const [editingPackage, setEditingPackage] = useState(null);

  useEffect(() => {
    // Fetch packages from the backend
    axios.get("http://localhost:5000/packages")
      .then(response => setPackages(response.data))
      .catch(error => console.error("Error fetching packages:", error));
  }, []);

  const handleDelete = (id) => {
    // Delete a package
    axios.delete(`http://localhost:5000/packages/${id}`)
      .then(() => setPackages(packages.filter(pkg => pkg._id !== id)))
      .catch(error => console.error("Error deleting package:", error));
  };

  return (
    <div className="package-list-page">
      <h1>Package Management</h1>
      
      {/* Add a package */}
      <PackageForm setPackages={setPackages} />
      
      {/* Update package if any package is selected for editing */}
      {editingPackage && (
        <UpdatePackageForm 
          packageData={editingPackage} 
          setEditingPackage={setEditingPackage} 
          setPackages={setPackages} 
        />
      )}

      {/* List of packages */}
      <div className="package-list">
        {packages.map(pkg => (
          <div key={pkg._id} className="package-card">
            <h2>{pkg.packageName}</h2>
            <p>{pkg.description}</p>
            <p>Price: {pkg.price}</p>
            <p>Service Provider: {pkg.serviceProvider}</p>
            <button onClick={() => setEditingPackage(pkg)}>Edit</button>
            <button onClick={() => handleDelete(pkg._id)}>Delete</button>
          </div>
        ))}
      </div>

      {/* Discount report */}
      <ReportPage />
    </div>
  );
};

export default PackageListPage;
