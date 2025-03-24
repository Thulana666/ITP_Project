import React, { useState, useEffect } from "react";
import PackageForm from "./PackageForm";
import UpdatePackageForm from "./UpdatePackageForm";
import ReportPage from "./spReportPage";
import axios from "axios";
import "../styles/styles.css";

const PackageList = () => {
  const [packages, setPackages] = useState([]);
  const [editingPackage, setEditingPackage] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/packages")
      .then(response => setPackages(response.data))
      .catch(error => console.error("Error fetching packages:", error));
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/packages/${id}`)
      .then(() => setPackages(packages.filter(pkg => pkg._id !== id)))
      .catch(error => console.error("Error deleting package:", error));
  };

  return (
    <div className="container">
      <PackageForm setPackages={setPackages} />
      {editingPackage && <UpdatePackageForm packageData={editingPackage} setEditingPackage={setEditingPackage} setPackages={setPackages} />}
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
      <ReportPage />
    </div>
  );
};

export default PackageList;
