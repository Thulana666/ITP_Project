import React, { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import "../styles/PaymentReportPage.css";

Chart.register(...registerables);

const PaymentReport = () => {
  const [paymentData, setPaymentData] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/payments");
      const data = await response.json();
      setPaymentData(data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  // Calculate Payment Methods Count
  const paymentMethodCounts = paymentData.reduce(
    (acc, payment) => {
      acc[payment.paymentMethod] = (acc[payment.paymentMethod] || 0) + 1;
      return acc;
    },
    { Cash: 0, "Bank Transfer": 0 }
  );

  // Generate Monthly Income Data
  const monthlyIncome = Array(12).fill(0);
  paymentData.forEach((payment) => {
    const month = new Date(payment.createdAt).getMonth();
    monthlyIncome[month] += payment.amount;
  });

  // Pie Chart Data
  const pieData = {
    labels: ["Bank Transfer", "Cash"],
    datasets: [
      {
        data: [paymentMethodCounts["Bank Transfer"], paymentMethodCounts["Cash"]],
        backgroundColor: ["#808080", "#A9A9A9"],
        borderWidth: 1,
      },
    ],
  };

  // Bar Chart Data
  const barData = {
    labels: Array.from({ length: 12 }, (_, i) => i + 1),
    datasets: [
      {
        label: "Monthly Income",
        data: monthlyIncome,
        backgroundColor: "#808080",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="charts-container">
      <div className="chart-box">
        <h3>Payment Method</h3>
        <Pie data={pieData} />
      </div>
      <div className="chart-box">
        <h3>Monthly Income</h3>
        <Bar data={barData} />
      </div>
    </div>
  );
};

export default PaymentReport;
