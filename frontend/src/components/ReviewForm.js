import React, { useState, useContext } from "react";
import { ReviewContext } from "../context/ReviewContext";
import { addReview } from "../services/reviewServices";

const ReviewForm = () => {
  const { fetchReviews } = useContext(ReviewContext);
  const [review, setReview] = useState({
    name: "",
    description: "",
    rating: 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addReview(review);
    fetchReviews();
    setReview({ name: "", description: "", rating: 0 });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Your Name"
        value={review.name}
        onChange={(e) => setReview({ ...review, name: e.target.value })}
        required
      />
      <textarea
        placeholder="Your Review"
        value={review.description}
        onChange={(e) => setReview({ ...review, description: e.target.value })}
        required
      />
      <input
        type="number"
        min="1"
        max="5"
        value={review.rating}
        onChange={(e) => setReview({ ...review, rating: e.target.value })}
        required
      />
      <button type="submit"> Submit Review </button>{" "}
    </form>
  );
};

export default ReviewForm;
