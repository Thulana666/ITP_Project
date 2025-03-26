import React from "react";

const ReviewItem = ({ review }) => {
  return (
    <div className="review-item">
      <h3> {review.name} </h3> <p> {review.description} </p>{" "}
      <span> ⭐{review.rating} </span>{" "}
    </div>
  );
};

export default ReviewItem;
