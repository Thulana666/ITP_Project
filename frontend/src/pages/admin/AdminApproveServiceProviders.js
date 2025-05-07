import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/AdminApproveServiceProviders.css";

const AdminApproveServiceProviders = () => {
  const [serviceProviders, setServiceProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchServiceProviders();
  }, []);

  const fetchServiceProviders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized. Please log in again.");
        return;
      }

      const response = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const providers = response.data.filter((user) => user.role === "service_provider");
      setServiceProviders(providers);
    } catch (error) {
      setError("Error fetching service providers.");
      console.error("Error fetching service providers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized. Please log in again.");
        return;
      }

      await axios.put(
        `http://localhost:5000/api/admin/approve-service-provider/${id}`,
        { approvalStatus: status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchServiceProviders();
    } catch (error) {
      setError("Error updating approval status.");
      console.error("Error updating approval status:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Approve/Reject Service Providers</h2>

      {loading ? (
        <p style={styles.loadingText}>Loading service providers...</p>
      ) : error ? (
        <p style={styles.errorText}>{error}</p>
      ) : serviceProviders.length === 0 ? (
        <p style={styles.noProvidersText}>No service providers found.</p>
      ) : (
        <ul style={styles.list}>
          {serviceProviders.map((sp) => (
            <li key={sp._id} style={styles.listItem}>
              <div style={styles.providerDetails}>
                <div style={styles.providerName}>{sp.fullName}</div>
                <div style={styles.providerEmail}>{sp.email}</div>
                <div style={styles.statusBadge} className={sp.approvalStatus ? 'approved' : 'pending'}>
                  {sp.approvalStatus ? "Approved" : "Pending"}
                </div>
              </div>
              {!sp.approvalStatus && (
                <div style={styles.buttonContainer}>
                  <button
                    onClick={() => handleApproval(sp._id, true)}
                    style={styles.approveButton}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproval(sp._id, false)}
                    style={styles.rejectButton}
                  >
                    Reject
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  header: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "#333",
    textAlign: "center",
  },
  loadingText: {
    fontSize: "18px",
    color: "#555",
    textAlign: "center",
  },
  errorText: {
    fontSize: "18px",
    color: "#e74c3c",
    textAlign: "center",
    fontWeight: "bold",
  },
  noProvidersText: {
    fontSize: "18px",
    color: "#7f8c8d",
    textAlign: "center",
  },
  list: {
    listStyleType: "none",
    padding: "0",
    margin: "0",
  },
  listItem: {
    backgroundColor: '#fff',
    padding: '20px',
    margin: '15px 0',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  providerDetails: {
    flex: 1,
  },
  providerName: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '5px',
  },
  providerEmail: {
    fontSize: '14px',
    color: '#7f8c8d',
    marginBottom: '5px',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  buttonContainer: {
    display: 'flex',
    gap: '10px',
  },
  approveButton: {
    backgroundColor: '#2ecc71',
    color: '#fff',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: '#27ae60',
    },
  },
  rejectButton: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: '#c0392b',
    },
  },
};

export default AdminApproveServiceProviders;
