// src/components/ReportPage.js
import React, { useState } from 'react';
import axios from 'axios';

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

const ReportPage = ({ selectedPackages }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateReport = async () => {
    // Extract IDs from selected packages
    const selectedPackageIds = Object.values(selectedPackages)
      .filter(Boolean)
      .map(pkg => pkg._id);
    
    if (selectedPackageIds.length === 0) {
      setError('Please select at least one package to generate a report.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('http://localhost:5000/api/packages/generate-report', {
        selectedPackageIds
      });
      
      setReport(response.data);
    } catch (err) {
      console.error('Error generating report:', err);
      setError(err.response?.data?.message || 'Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!report) return;
    
    // Create a printable version of the report
    const reportContent = `
      Event Services Report
      --------------------
      
      Selected Packages:
      ${report.selectedPackages.map(pkg => 
        `${pkg.serviceProvider}: ${pkg.packageName} - ${formatCurrency(pkg.price)}`
      ).join('\n')}
      
      ${report.discountApplied ? `Discount Applied: ${report.discountPercentage}%` : 'No discount applied'}
      
      Total Price: ${formatCurrency(report.totalPrice)}
      
      Generated on: ${new Date().toLocaleString()}
    `;
    
    // Create a blob and download link
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'event-services-report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="report-container" style={{
      margin: '30px 0',
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    }}>
      {!report ? (
        <div className="report-generator" style={{ textAlign: 'center' }}>
          <h3 style={{ marginBottom: '15px' }}>Generate Package Report</h3>
          {error && <div className="error-message" style={{ 
            backgroundColor: '#ffebee',
            color: '#d32f2f',
            padding: '10px 15px',
            borderRadius: '4px',
            marginBottom: '20px'
          }}>{error}</div>}
          <p style={{ marginBottom: '20px', color: '#666' }}>Generate a detailed report of your selected service packages.</p>
          <button 
            style={{
              backgroundColor: '#1c1c25',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
            onClick={generateReport}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      ) : (
        <div className="report-details">
          <div className="report-header" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            paddingBottom: '10px',
            borderBottom: '1px solid #eee'
          }}>
            <h3 style={{ margin: 0 }}>Event Services Report</h3>
            <div className="report-actions" style={{ display: 'flex', gap: '10px' }}>
              <button 
                style={{ padding: '8px 12px', backgroundColor: '#1c1c25', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                onClick={downloadReport}
              >
                Download
              </button>
              <button 
                style={{ padding: '8px 12px', backgroundColor: '#f5f5f5', color: '#333', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
                onClick={() => setReport(null)}
              >
                Back
              </button>
            </div>
          </div>
          
          <div className="report-content">
            <div className="report-section" style={{ marginBottom: '20px' }}>
              <h4 style={{ marginBottom: '15px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>Selected Packages</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {report.selectedPackages.map((pkg, index) => (
                  <li key={index} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    padding: '10px 0',
                    borderBottom: '1px solid #f5f5f5'
                  }}>
                    <div>
                      <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>{pkg.serviceProvider}</div>
                      <div style={{ fontSize: '16px', fontWeight: '500' }}>{pkg.packageName}</div>
                    </div>
                    <div style={{ fontWeight: '600', color: '#0066cc' }}>{formatCurrency(pkg.price)}</div>
                  </li>
                ))}
              </ul>
            </div>
            
            {report.discountApplied && (
              <div className="discount-section" style={{
                backgroundColor: '#e3f2fd',
                padding: '15px',
                borderRadius: '4px',
                marginBottom: '20px'
              }}>
                <h4 style={{ color: '#0066cc', marginBottom: '10px' }}>Discount Applied</h4>
                <p style={{ margin: 0, color: '#0066cc' }}>A {report.discountPercentage}% discount has been applied for selecting services from multiple categories.</p>
              </div>
            )}
            
            <div className="total-section">
              <h4 style={{ marginBottom: '10px' }}>Total Price</h4>
              <div style={{ fontSize: '24px', fontWeight: '600', textAlign: 'right' }}>{formatCurrency(report.totalPrice)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportPage;