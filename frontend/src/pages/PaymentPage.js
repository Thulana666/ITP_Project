import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/PaymentPage.css";

const PaymentPage = () => {
  const location = useLocation();
  const bookingData = location.state || {};

  const [paymentData, setPaymentData] = useState({
    userId: "64a1e76f5ab8ed2f86b0c123", //temp hardcoded
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    paymentMethod: "Bank Transfer",
    amount: bookingData.totalPrice || "", // Pre-fill with passed total price
    file: null,
    bookingId: bookingData.bookingId || null, // Store booking ID
    selectedPackages: bookingData.selectedPackages || [] // Store selected packages
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [fileError, setFileError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState("");
  const [formError, setFormError] = useState("");

  const formatFieldName = (name) => {
    switch(name) {
      case 'firstName':
        return 'First name';
      case 'lastName':
        return 'Last name';
      default:
        return name;
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        return value.trim() === '' ? `${formatFieldName(name)} is required` : '';
      case 'email':
        return !value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ? 'Invalid email format' : '';
      case 'phone':
        return !value.match(/^[0-9]{10}$/) ? 'Phone number must be 10 digits' : '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({ ...paymentData, [name]: value });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentData({ ...paymentData, file });
      setFileName(file.name);
      setFileError("");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setPaymentData({ ...paymentData, file });
      setFileName(file.name);
      setFileError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (paymentData.paymentMethod === "Bank Transfer" && !paymentData.file) {
      setFileError("Payment slip is required for bank transfer.");
      return;
    }

    const formData = new FormData();
    formData.append("userId", paymentData.userId);
    formData.append("firstName", paymentData.firstName);
    formData.append("lastName", paymentData.lastName);
    formData.append("email", paymentData.email);
    formData.append("phone", paymentData.phone);
    formData.append("paymentMethod", paymentData.paymentMethod);
    formData.append("amount", paymentData.amount);
    formData.append("bookingId", paymentData.bookingId); // Add booking ID to form data
    if (paymentData.file) {
      formData.append("paymentSlip", paymentData.file);
    }
    console.log(formData);
    try {
      const response = await fetch("http://localhost:5000/api/payments", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Payment submitted successfully!");
        setPaymentData({
          userId: "64a1e76f5ab8ed2f86b0c123", // Keep the user ID
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          paymentMethod: "Bank Transfer",
          amount: "",
          file: null,
          bookingId: null,
          selectedPackages: []
        });
        setFileName("");
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        setFormError(errorData.error || errorData.details || "Error submitting payment. Please check your form data.");
      }
    } catch (error) {
      console.error("Error:", error);
      setFormError("Failed to submit payment. Please check your internet connection.");
    }
  };

  return (
    <div className="payment-container">
      <h2>Payment</h2>
      
      {formError && (
        <div className="error-message" style={{ color: "red", marginBottom: "15px" }}>
          {formError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="payment-form">
        <div className="input-group">
          <div>
            <label>First Name</label>
            <input type="text" name="firstName" value={paymentData.firstName} onChange={handleChange} required />
            {errors.firstName && <p style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{errors.firstName}</p>}
          </div>
          <div>
            <label>Last Name</label>
            <input type="text" name="lastName" value={paymentData.lastName} onChange={handleChange} required />
            {errors.lastName && <p style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{errors.lastName}</p>}
          </div>
        </div>

        <div className="input-group">
          <div>
            <label>E-mail address</label>
            <input type="email" name="email" value={paymentData.email} onChange={handleChange} required />
            {errors.email && <p style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{errors.email}</p>}
          </div>
          <div>
            <label>Phone number</label>
            <input 
              type="tel" 
              name="phone" 
              value={paymentData.phone} 
              onChange={handleChange} 
              pattern="[0-9]{10}"
              title="Phone number must be exactly 10 digits"
              required 
            />
            {errors.phone && <p style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{errors.phone}</p>}
          </div>
        </div>

        <div className="input-group">
          <div>
            <label>Amount (LKR)</label>
            <input 
              type="number" 
              name="amount" 
              value={paymentData.amount} 
              onChange={handleChange} 
              min="0.01" 
              step="0.01" 
              required 
              disabled
            />
          </div>
        </div>

        <div className="payment-options">
          <label>Payment Option</label>
          <div className="payment-methods">
            <label className="custom-checkbox">
              <input
                type="radio"
                name="paymentMethod"
                value="Cash"
                checked={paymentData.paymentMethod === "Cash"}
                onChange={handleChange}
              />
              <span className="icon">💰</span> Cash
            </label>

            <label className="custom-checkbox">
              <input
                type="radio"
                name="paymentMethod"
                value="Bank Transfer"
                checked={paymentData.paymentMethod === "Bank Transfer"}
                onChange={handleChange}
              />
              <span className="icon">🏦</span> Bank Transfer
            </label>
          </div>
        </div>

        {paymentData.paymentMethod === "Bank Transfer" && (
          <div className="file-upload">
            <label>Upload payment slip (Required for Bank Transfer)</label>
            <div
              className={`drop-area ${dragActive ? "drag-active" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input type="file" name="file" accept="image/*, application/pdf" onChange={handleFileChange} />
              <p>{fileName ? `📄 ${fileName}` : "📤 Drag & drop here or select one"}</p>
            </div>
            {fileError && <p className="error-text" style={{ color: "red" }}>{fileError}</p>}
          </div>
        )}

        <button className="globalButton" type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PaymentPage;