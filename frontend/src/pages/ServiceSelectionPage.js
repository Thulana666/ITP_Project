import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ReportPage from "../components/ReportPage";
import ServiceProviderProfileModal from "../components/ServiceProviderProfileModal";
import { useLocation, useNavigate } from "react-router-dom";

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

  const [packages, setPackages] = useState({
    Photographer: [],
    Hotel: [],
    "Music Band": [],
  });

  const [selectedPackages, setSelectedPackages] = useState({
    Photographer: null,
    Hotel: null,
    "Music Band": null,
  });

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

      // Group packages by service provider type
      const groupedPackages = {
        Photographer: [],
        Hotel: [],
        "Music Band": [],
      };

      response.data.forEach((pkg) => {
        if (groupedPackages[pkg.serviceProvider]) {
          groupedPackages[pkg.serviceProvider].push(pkg);
        }
      });

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
      const formattedPackages = Object.entries(selectedPackages)
        .filter(([_, pkg]) => pkg !== null)
        .map(([serviceType, pkg]) => ({
          serviceType,
          packageId: pkg._id,
          packageName: pkg.packageName,
          price: pkg.price
        }));

      const response = await axios.put(`http://localhost:5000/api/bookings/${bookingId}/packages`, {
        packages: formattedPackages,
        totalPrice: totalPrice
      });

      if (response.data.success) {
        navigate('/payment', { 
          state: { 
            bookingId,
            totalAmount: totalPrice,
            packages: formattedPackages,
            booking: response.data.booking
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

  return (
    <div className="service-selection-container">
      <h1>Select Service Providers And Packages</h1>

      <div className="service-categories">
        {/* Photographers Section */}
        <section className="service-category">
          <h2>1. Photographers</h2>
          <div className="service-providers">
            {packages.Photographer.map((pkg) => (
              <div key={pkg._id} className="provider-card">
                <div className="provider-select">
                  <input
                    type="radio"
                    id={`photographer-${pkg._id}`}
                    name="photographer"
                    checked={selectedPackages.Photographer?._id === pkg._id}
                    onChange={() => handlePackageSelect("Photographer", pkg._id)}
                  />
                  <label htmlFor={`photographer-${pkg._id}`}>
                    {pkg.packageName}
                  </label>
                </div>

                <div className="package-actions">
                  <select
                    value={
                      selectedPackages.Photographer?._id === pkg._id
                        ? pkg._id
                        : ""
                    }
                    onChange={(e) =>
                      handlePackageSelect("Photographer", e.target.value)
                    }
                    className="package-select"
                  >
                    <option value="">Select Package</option>
                    <option value={pkg._id}>
                      {pkg.packageName} - {formatCurrency(pkg.price)}
                    </option>
                  </select>

                  <button
                    className="btn-view-profile"
                    onClick={() => handleViewProfile("Photographer", pkg._id)}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Hotels Section */}
        <section className="service-category">
          <h2>2. Hotels</h2>
          <div className="service-providers">
            {packages.Hotel.map((pkg) => (
              <div key={pkg._id} className="provider-card">
                <div className="provider-select">
                  <input
                    type="radio"
                    id={`hotel-${pkg._id}`}
                    name="hotel"
                    checked={selectedPackages.Hotel?._id === pkg._id}
                    onChange={() => handlePackageSelect("Hotel", pkg._id)}
                  />
                  <label htmlFor={`hotel-${pkg._id}`}>{pkg.packageName}</label>
                </div>

                <div className="package-actions">
                  <select
                    value={
                      selectedPackages.Hotel?._id === pkg._id ? pkg._id : ""
                    }
                    onChange={(e) =>
                      handlePackageSelect("Hotel", e.target.value)
                    }
                    className="package-select"
                  >
                    <option value="">Select Package</option>
                    <option value={pkg._id}>
                      {pkg.packageName} - {formatCurrency(pkg.price)}
                    </option>
                  </select>

                  <button
                    className="btn-view-profile"
                    onClick={() => handleViewProfile("Hotel", pkg._id)}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Music Bands Section */}
        <section className="service-category">
          <h2>3. Music Bands</h2>
          <div className="service-providers">
            {packages["Music Band"].map((pkg) => (
              <div key={pkg._id} className="provider-card">
                <div className="provider-select">
                  <input
                    type="radio"
                    id={`band-${pkg._id}`}
                    name="band"
                    checked={selectedPackages["Music Band"]?._id === pkg._id}
                    onChange={() =>
                      handlePackageSelect("Music Band", pkg._id)
                    }
                  />
                  <label htmlFor={`band-${pkg._id}`}>{pkg.packageName}</label>
                </div>

                <div className="package-actions">
                  <select
                    value={
                      selectedPackages["Music Band"]?._id === pkg._id
                        ? pkg._id
                        : ""
                    }
                    onChange={(e) =>
                      handlePackageSelect("Music Band", e.target.value)
                    }
                    className="package-select"
                  >
                    <option value="">Select Package</option>
                    <option value={pkg._id}>
                      {pkg.packageName} - {formatCurrency(pkg.price)}
                    </option>
                  </select>

                  <button
                    className="btn-view-profile"
                    onClick={() => handleViewProfile("Music Band", pkg._id)}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="service-summary">
        <div className="selected-services">
          <h3>Selected Services</h3>
          <ul>
            {selectedPackages.Photographer && (
              <li>
                <strong>Photographer:</strong>{" "}
                {selectedPackages.Photographer.packageName} -{" "}
                {formatCurrency(selectedPackages.Photographer.price)}
              </li>
            )}
            {selectedPackages.Hotel && (
              <li>
                <strong>Hotel:</strong> {selectedPackages.Hotel.packageName} -{" "}
                {formatCurrency(selectedPackages.Hotel.price)}
              </li>
            )}
            {selectedPackages["Music Band"] && (
              <li>
                <strong>Music Band:</strong>{" "}
                {selectedPackages["Music Band"].packageName} -{" "}
                {formatCurrency(selectedPackages["Music Band"].price)}
              </li>
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