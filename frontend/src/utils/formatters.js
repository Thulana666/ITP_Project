// src/utils/formatters.js

/**
 * Format a number as Sri Lankan Rupees currency
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return 'LKR 0.00';
    
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  /**
   * Format a date string to a readable format
   * @param {string} dateString - The date string to format
   * @returns {string} - Formatted date string
   */
  export const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  /**
   * Truncate a long string and add ellipsis
   * @param {string} text - The text to truncate
   * @param {number} length - Maximum length before truncation
   * @returns {string} - Truncated text with ellipsis if needed
   */
  export const truncateText = (text, length = 100) => {
    if (!text) return '';
    if (text.length <= length) return text;
    
    return text.substring(0, length) + '...';
  };