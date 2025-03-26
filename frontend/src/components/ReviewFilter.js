import React, { useState } from "react";
import { filterReviews } from "../api/api";

const ReviewFilter = ({ setFilteredReviews }) => {
  const [rating, setRating] = useState("");

  const handleFilter = async () => {
    const query = `rating=${rating}`;
    const filtered = await filterReviews(query);
    setFilteredReviews(filtered);
  };

  return (
    <div className="review-filter">
      <select value={rating} onChange={(e) => setRating(e.target.value)}>
        <option value=""> All Ratings </option>{" "}
        <option value="5"> 5 Stars </option>{" "}
        <option value="4"> 4 + Stars </option>{" "}
        <option value="3"> 3 + Stars </option>{" "}
      </select>{" "}
      <button onClick={handleFilter}> Filter </button>{" "}
    </div>
  );
};

export default ReviewFilter;
