import React, { useState, useContext } from "react";
import { ReviewContext } from "../context/ReviewContext";
import { addReview } from "../services/reviewServices";

const ReviewForm = () => {
  const { fetchReviews } = useContext(ReviewContext);
  const [review, setReview] = useState({
    name: "",
    description: "",
    rating: 0,
    title: "", // Add title field
  });

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    rating: "",
    title: "",
  });

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        return value.trim() === "" ? "Name is required" : "";
      case "description":
        return value.trim() === "" ? "Review description is required" : "";
      case "title":
        return value.trim() === "" ? "Review title is required" : "";
      case "rating":
        return value <= 0 ? "Rating is required" : "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReview({ ...review, [name]: value });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    const newErrors = {
      name: validateField("name", review.name),
      description: validateField("description", review.description),
      rating: validateField("rating", review.rating),
      title: validateField("title", review.title),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      return; // Don't submit if there are errors
    }

    await addReview(review);
    fetchReviews();
    setReview({ name: "", description: "", rating: 0, title: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          name="title"
          placeholder="Review Title"
          value={review.title}
          onChange={handleChange}
          required
        />
        {errors.title && (
          <p className="error-text" style={{ color: "red", fontSize: "12px" }}>
            {errors.title}
          </p>
        )}
      </div>

      <div className="form-group">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={review.name}
          onChange={handleChange}
          required
        />
        {errors.name && (
          <p className="error-text" style={{ color: "red", fontSize: "12px" }}>
            {errors.name}
          </p>
        )}
      </div>

      <div className="form-group">
        <textarea
          name="description"
          placeholder="Your Review"
          value={review.description}
          onChange={handleChange}
          required
        />
        {errors.description && (
          <p className="error-text" style={{ color: "red", fontSize: "12px" }}>
            {errors.description}
          </p>
        )}
      </div>

      <div className="form-group">
        <input
          type="number"
          name="rating"
          min="1"
          max="5"
          value={review.rating}
          onChange={handleChange}
          required
        />
        {errors.rating && (
          <p className="error-text" style={{ color: "red", fontSize: "12px" }}>
            {errors.rating}
          </p>
        )}
      </div>

      <button type="submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm;
