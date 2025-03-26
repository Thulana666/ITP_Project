import { createContext, useState, useEffect } from "react";
import { getReviews } from "../services/reviewServices";

export const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async() => {
        const data = await getReviews();
        setReviews(data);
    };

    return ( <
        ReviewContext.Provider value = {
            { reviews, setReviews, fetchReviews }
        } > { children } <
        /ReviewContext.Provider>
    );
};