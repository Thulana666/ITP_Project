import React, { useState } from "react";
import { submitPayment } from "../services/paymentService";

const PaymentForm = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        amount: "",
        paymentMethod: "Credit Card"
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await submitPayment(formData);
        alert("Payment submitted!");
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="firstName" placeholder="First Name" onChange={handleChange} required />
            <input name="lastName" placeholder="Last Name" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="number" name="amount" placeholder="Amount" onChange={handleChange} required />
            <select name="paymentMethod" onChange={handleChange}>
                <option value="Credit Card">Credit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
            </select>
            <button type="submit">Submit Payment</button>
        </form>
    );
};

export default PaymentForm;
