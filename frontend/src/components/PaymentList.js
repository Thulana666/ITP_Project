import React, { useEffect, useState } from "react";
import { getPayments } from "../services/paymentServices";

const PaymentList = () => {
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        const fetchPayments = async () => {
            const data = await getPayments();
            setPayments(data);
        };
        fetchPayments();
    }, []);

    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Amount</th>
                    <th>Payment Method</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {payments.map((p) => (
                    <tr key={p.id}>
                        <td>{p.firstName} {p.lastName}</td>
                        <td>{p.email}</td>
                        <td>${p.amount}</td>
                        <td>{p.paymentMethod}</td>
                        <td>{p.status}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default PaymentList;
