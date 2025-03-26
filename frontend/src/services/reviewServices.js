// Updated reviewServices.js to work with our backend

import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Configure axios with auth token if available
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Review services
export const getReviews = async () => {
    try {
        const response = await axios.get(`${API_URL}/reviews`);
        return response.data;
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return [];
    }
};

export const getReviewsByService = async (serviceId) => {
    try {
        const response = await axios.get(`${API_URL}/reviews/${serviceId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching reviews for service ${serviceId}:`, error);
        return [];
    }
};

export const addReview = async (review) => {
    try {
        const response = await axios.post(`${API_URL}/reviews`, review, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error("Error adding review:", error);
        throw error;
    }
};

export const updateReview = async (id, review) => {
    try {
        const response = await axios.put(`${API_URL}/reviews/${id}`, review, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating review ${id}:`, error);
        throw error;
    }
};

export const deleteReview = async (id) => {
    try {
        await axios.delete(`${API_URL}/reviews/${id}`, {
            headers: getAuthHeader()
        });
    } catch (error) {
        console.error(`Error deleting review ${id}:`, error);
        throw error;
    }
};

export const getReviewStats = async () => {
    try {
        const response = await axios.get(`${API_URL}/reviews/report`);
        return response.data;
    } catch (error) {
        console.error("Error fetching review stats:", error);
        return { totalReviews: 0, averageRating: 0 };
    }
};

export const getMonthlyReport = async () => {
    try {
        const response = await axios.get(`${API_URL}/reviews/monthly-report`);
        return response.data;
    } catch (error) {
        console.error("Error fetching monthly report:", error);
        return [];
    }
};

// Auth services
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, userData);
        return response.data;
    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, credentials);
        return response.data;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
};

export const verifyOTP = async (verificationData) => {
    try {
        const response = await axios.post(`${API_URL}/auth/verify-otp`, verificationData);
        return response.data;
    } catch (error) {
        console.error("Error verifying OTP:", error);
        throw error;
    }
};