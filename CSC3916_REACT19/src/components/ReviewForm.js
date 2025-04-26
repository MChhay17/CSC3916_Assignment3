import React, { useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const ReviewForm = ({ movieId, onReviewSubmit }) => {
  const [rating, setRating] = useState("");
  const [review, setReview] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `${API_URL}/reviews`,
        { movieId, review, rating: parseInt(rating, 10) },
        { headers: { Authorization: token } }
      );
      setMessage("Review submitted!");
      setRating("");
      setReview("");
      onReviewSubmit();
    } catch (err) {
      setMessage("Error submitting review.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Leave a Review</h3>
      {message && <p>{message}</p>}
      <label>Rating (1–5):</label>
      <input
        type="number"
        value={rating}
        min="1"
        max="5"
        required
        onChange={(e) => setRating(e.target.value)}
      /><br />
      <label>Comment:</label>
      <textarea
        value={review}
        required
        onChange={(e) => setReview(e.target.value)}
      /><br />
      <button type="submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm;