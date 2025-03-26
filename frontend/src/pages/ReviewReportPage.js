import React, { useEffect, useState } from "react";
import axios from "axios";
import "./../styles/ReviewReportPage.css";

const ReviewReportPage = () => {
    const [totalReviews, setTotalReviews] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [monthlyReport, setMonthlyReport] = useState([]);

    useEffect(() => {
        const fetchReportData = async() => {
            try {
                const response = await axios.get("http://localhost:5000/api/reviews/report");
                setTotalReviews(response.data.totalReviews);
                setAverageRating(response.data.averageRating);
            } catch (error) {
                console.error("Error fetching report data:", error);
            }
        };

        const fetchMonthlyReport = async() => {
            try {
                const response = await axios.get("http://localhost:5000/api/reviews/monthly-report");
                setMonthlyReport(response.data);
            } catch (error) {
                console.error("Error fetching monthly report:", error);
            }
        };

        fetchReportData();
        fetchMonthlyReport();
    }, []);

    return ( <
        div className = "report-container" >
        <
        h2 > Monthly Review < /h2>

        { /* Summary Cards */ } <
        div className = "report-summary" >
        <
        div className = "report-card" >
        <
        h4 > Total Reviews < /h4> <
        p > { totalReviews } < /p> <
        /div> <
        div className = "report-card" >
        <
        h4 > Average Rating < /h4> <
        p > { averageRating.toFixed(1) }⭐ < /p> <
        /div> <
        /div>

        { /* Monthly Review Table */ } <
        div className = "table-container" >
        <
        h4 > Monthly Review Report(Last 12 Months) < /h4> <
        div className = "table-wrapper" >
        <
        table >
        <
        thead >
        <
        tr >
        <
        th > Month < /th> <
        th > Total Reviews < /th> <
        th > Average Rating < /th> <
        /tr> <
        /thead> <
        tbody > {
            monthlyReport.map((report, index) => ( <
                tr key = { index } >
                <
                td > { `${report._id.month}/${report._id.year}` } < /td> <
                td > { report.totalReviews } < /td> <
                td > { report.averageRating.toFixed(1) } < /td> <
                /tr>
            ))
        } <
        /tbody> <
        /table> <
        /div> <
        /div> <
        /div>
    );
};

export default ReviewReportPage;