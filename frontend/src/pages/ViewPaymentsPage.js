import React, { useEffect, useState } from "react";
import "../styles/ViewPaymentsPage.css";

const ViewPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/payments");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setPayments(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching payments:", error);
      setError("Failed to load payments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (status) => {
    setFilter(status);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await fetch(`http://localhost:5000/api/payments/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchPayments();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      try {
        await fetch(`http://localhost:5000/api/payments/${id}`, {
          method: "DELETE",
        });
        fetchPayments();
      } catch (error) {
        console.error("Error deleting payment:", error);
      }
    }
  };

  // Safe string check helper function
  const safeString = (str) => {
    return str ? String(str).toLowerCase() : '';
  };

  const filteredPayments = payments.filter((payment) => {
    return (
      (filter === "all" || payment.status === filter) &&
      (safeString(payment.firstName).includes(searchTerm.toLowerCase()) ||
       safeString(payment.lastName).includes(searchTerm.toLowerCase()) ||
       safeString(payment.email).includes(searchTerm.toLowerCase()))
    );
  });

  if (loading) {
    return <div className="payments-container">Loading payments...</div>;
  }

  if (error) {
    return <div className="payments-container error">{error}</div>;
  }

  return (
    <div className="payments-container">
      <h2>Payment Details</h2>

      <div className="control-panel">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="filter-buttons">
          <button 
            className={filter === "all" ? "active" : ""} 
            onClick={() => handleFilterChange("all")}
          >
            ALL
          </button>
          <button 
            className={filter === "Pending" ? "active" : ""}
            onClick={() => handleFilterChange("Pending")}
          >
            PENDING
          </button>
          <button 
            className={filter === "Paid" ? "active" : ""}
            onClick={() => handleFilterChange("Paid")}
          >
            PAID
          </button>
        </div>
      </div>

      {payments.length === 0 ? (
        <p className="no-data-message">No payments found.</p>
      ) : (
        <div className="table-container">
          <table className="payments-table">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment._id}>
                  <td>{payment.firstName || 'N/A'}</td>
                  <td>{payment.lastName || 'N/A'}</td>
                  <td>{payment.email || 'N/A'}</td>
                  <td>{payment.phone || 'N/A'}</td>
                  <td>{payment.paymentMethod || 'N/A'}</td>
                  <td>{payment.amount ? `Rs. ${Number(payment.amount).toLocaleString()}` : 'N/A'}</td>
                  <td>
                    <button
                      className={`status-badge ${payment.status?.toLowerCase() || 'unknown'}`}
                      onClick={() =>
                        handleStatusUpdate(
                          payment._id,
                          payment.status === "Pending" ? "Paid" : "Pending"
                        )
                      }
                    >
                      {payment.status || 'Unknown'}
                    </button>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {payment.paymentSlip && (
                        <a 
                          href={`http://localhost:5000/uploads/${payment.paymentSlip}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="view-btn"
                          title="View Payment Slip"
                        >
                          👁️
                        </a>
                      )}
                      <button 
                        className="delete-btn" 
                        onClick={() => handleDelete(payment._id)}
                        title="Delete Payment"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewPaymentsPage;