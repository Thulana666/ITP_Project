import React, { useContext, useEffect } from "react";
import { ReviewContext } from "../context/ReviewContext";
// Remove the import from ../pages/ReviewsPage

const ReviewList = () => {
  const { reviews, fetchReviews } = useContext(ReviewContext);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return (
    <div className="review-list">
      <h2> Recent Reviews </h2>{" "}
      {reviews.length === 0 ? (
        <p> No reviews yet.Be the first to add one! </p>
      ) : (
        <ul>
          {" "}
          {reviews.map((review) => (
            <li key={review.id} className="review-item">
              <h3> {review.name} </h3> <p> {review.description} </p>{" "}
              <div className="rating">
                {" "}
                Rating: {review.rating}
                /5
              </div>
            </li>
          ))}{" "}
        </ul>
      )}{" "}
    </div>
  );
};

export default ReviewList;
