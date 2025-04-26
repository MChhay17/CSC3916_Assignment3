import { useState } from 'react';
import axios from 'axios';

function ReviewForm({ movieId }) {
  const [rating, setRating] = useState('');
  const [review, setReview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Unauthorized. Please log in.');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/reviews`,
        {
          movieId,
          review,
          rating: parseInt(rating, 10) // Backend expects number
        },
        {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Review posted:', response.data);
      setSuccess('Review submitted successfully!');
      setRating('');
      setReview('');
    } catch (err) {
      console.error('❌ Error submitting review:', err);
      setError('Failed to submit review.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Submit a Review</h3>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <div>
        <label>Rating (1-5): </label>
        <input
          type="number"
          value={rating}
          min="1"
          max="5"
          required
          onChange={(e) => setRating(e.target.value)}
        />
      </div>

      <div>
        <label>Comment: </label>
        <textarea
          value={review}
          required
          onChange={(e) => setReview(e.target.value)}
        />
      </div>

      <button type="submit">Submit Review</button>
    </form>
  );
}

export default ReviewForm;
