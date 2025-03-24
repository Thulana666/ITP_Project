import axios from "axios";

const API_URL = "http://localhost:5000/api/payments";

export const submitPayment = async (paymentData) => {
    const response = await axios.post(API_URL, paymentData);
    return response.data;
};

export const getPayments = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};
