import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ReportPage from "../components/ReportPage";
import ServiceProviderProfileModal from "../components/ServiceProviderProfileModal";
import { useLocation, useNavigate } from "react-router-dom";
import { SERVICE_TYPES } from '../constants/serviceTypes';
import "../styles/ServiceSelection.css";

// Helper function for currency formatting
const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return 'LKR 0.00';
  
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

const ServiceSelectionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingId = location.state?.bookingId;
  console.log(bookingId);

  const [packages, setPackages] = useState(
    Object.fromEntries(SERVICE_TYPES.map(type => [type, []]))
  );

  const [selectedPackages, setSelectedPackages] = useState(
    Object.fromEntries(SERVICE_TYPES.map(type => [type, null]))
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(false);
  
  // State for provider profile modal
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Using useCallback to memoize the function
  const calculateTotal = useCallback(() => {
    // Calculate sum of selected package prices
    let sum = 0;
    let selectedCount = 0;

    Object.values(selectedPackages).forEach((pkg) => {
      if (pkg) {
        sum += pkg.price;
        selectedCount++;
      }
    });

    // Apply 10% discount if one service from each category is selected
    const discount = selectedCount === 3 ? sum * 0.1 : 0;
    setDiscountApplied(discount > 0);

    setTotalPrice(sum - discount);
  }, [selectedPackages]);

  useEffect(() => {
    fetchPackages();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [selectedPackages, calculateTotal]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/packages");

      // Initialize empty arrays for each service type
      const groupedPackages = Object.fromEntries(
        SERVICE_TYPES.map(type => [type, []])
      );

      // Group packages by their service type
      response.data.forEach((pkg) => {
        // Ensure the package has a valid service type that matches our constants
        if (pkg.serviceType && SERVICE_TYPES.includes(pkg.serviceType)) {
          groupedPackages[pkg.serviceType].push({
            _id: pkg._id,
            packageName: pkg.packageName,
            description: pkg.description,
            price: pkg.price,
            serviceType: pkg.serviceType,
            serviceProvider: pkg.serviceProvider,
            discount: pkg.discount || 0
          });
        } else {
          console.warn(`Package ${pkg._id} has invalid service type:`, pkg.serviceType);
        }
      });

      console.log('Grouped packages:', groupedPackages); // For debugging
      setPackages(groupedPackages);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching packages:", err);
      setError("Failed to load packages. Please try again.");
      setLoading(false);
    }
  };

  const handlePackageSelect = (serviceType, packageId) => {
    // Find the selected package
    const selectedPackage = packages[serviceType].find(
      (pkg) => pkg._id === packageId
    );

    setSelectedPackages((prev) => ({
      ...prev,
      [serviceType]: selectedPackage,
    }));
  };

  const handleViewProfile = (serviceType, packageId) => {
    // Find the package
    const pkg = packages[serviceType].find(pkg => pkg._id === packageId);
    
    if (pkg) {
      console.log("Selected package for profile:", pkg);
      
      // Create a provider object from the package data
      const providerData = {
        fullName: pkg.packageName,  // Using package name as fallback
        serviceType: pkg.serviceProvider,
        email: "Contact management for details",
        phoneNumber: "Contact management for details",
        // Add other details you have available
        packageDetails: {
          name: pkg.packageName,
          price: pkg.price,
          description: pkg.description,
          discount: pkg.discount || 0
        }
      };
      
      setSelectedPackage(providerData);
      setShowProfileModal(true);
    } else {
      console.error("Package not found:", packageId);
    }
  };

  const handleProceedToCheckout = async () => {
    if (!bookingId) {
      alert("No booking ID found. Please start from the event booking form.");
      navigate('/booking');
      return;
    }

    try {
      // Format selected packages into a clean JSON structure
      const formattedPackages = Object.entries(selectedPackages)
        .filter(([_, pkg]) => pkg !== null)
        .map(([serviceType, pkg]) => ({
          serviceType,
          packageId: pkg._id,
          packageName: pkg.packageName,
          price: pkg.price
        }));

      // Update the booking with selected packages
      const response = await axios.put(`http://localhost:5000/api/bookings/${bookingId}/packages`, {
        packages: formattedPackages,
        totalPrice: totalPrice
      });

      if (response.data.success) {
        console.log('Formateed', formattedPackages)
        console.log("Packages", selectedPackages)

         navigate('/manage-bookings', { 
          state: { 
             bookingId,
           totalPrice,
           selectedPackages: formattedPackages
           }
         }); 
      } else {
        alert("Failed to update booking with selected packages");
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Failed to update booking with selected packages");
    }
  };

  // Show warning if no booking ID is present
  useEffect(() => {
    if (!bookingId) {
      alert("Please start from the event booking form");
      navigate('/booking');
    }
  }, [bookingId, navigate]);

  if (loading) {
    return <div className="loading">Loading packages...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // Replace the hardcoded sections with dynamic rendering
  return (
    <div className="service-selection-container">
      <h1>Select Service Providers And Packages</h1>

      <div className="service-categories">
        {SERVICE_TYPES.map((serviceType, index) => (
          <section key={serviceType} className="service-category">
            <h2>{index + 1}. {serviceType}s</h2>
            <div className="service-providers">
              {packages[serviceType]?.map((pkg) => (
                <div key={pkg._id} className="provider-card">
                  <div className="provider-select">
                    <input
                      type="radio"
                      id={`${serviceType.toLowerCase()}-${pkg._id}`}
                      name={serviceType.toLowerCase()}
                      checked={selectedPackages[serviceType]?._id === pkg._id}
                      onChange={() => handlePackageSelect(serviceType, pkg._id)}
                    />
                    <label htmlFor={`${serviceType.toLowerCase()}-${pkg._id}`}>
                      {pkg.packageName} - By {pkg.providerName}
                    </label>
                  </div>

                  <div className="package-actions">
                    <select
                      value={selectedPackages[serviceType]?._id === pkg._id ? pkg._id : ""}
                      onChange={(e) => handlePackageSelect(serviceType, e.target.value)}
                      className="package-select"
                    >
                      <option value="">Select Package</option>
                      <option value={pkg._id}>
                        {pkg.packageName} by {pkg.providerName} - {formatCurrency(pkg.price)}
                      </option>
                    </select>

                    <button
                      className="btn-view-profile"
                      onClick={() => handleViewProfile(serviceType, pkg._id)}
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="service-summary">
        <div className="selected-services">
          <h3>Selected Services</h3>
          <ul>
            {Object.entries(selectedPackages).map(([type, pkg]) => 
              pkg && (
                <li key={type}>
                  <strong>{type}:</strong>{" "}
                  {pkg.packageName} - {formatCurrency(pkg.price)}
                </li>
              )
            )}
          </ul>

          {discountApplied && (
            <div className="discount-notice">
              <p>10% discount applied for selecting all three service types!</p>
            </div>
          )}

          <div className="total-price">
            <h3>Total: {formatCurrency(totalPrice)}</h3>
          </div>

          <button
            className="btn-checkout"
            onClick={handleProceedToCheckout}
            disabled={!Object.values(selectedPackages).some(Boolean)}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>

      {/* Report Component */}
      <ReportPage selectedPackages={selectedPackages} />

      {/* Provider Profile Modal */}
      {showProfileModal && (
        <ServiceProviderProfileModal 
          provider={selectedPackage} 
          onClose={() => setShowProfileModal(false)} 
        />
      )}
    </div>
  );
};

export default ServiceSelectionPage;