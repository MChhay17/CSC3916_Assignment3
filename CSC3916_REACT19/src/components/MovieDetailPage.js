import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function MovieDetailPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get(`${process.env.REACT_APP_API_URL}/movies/${id}?reviews=true`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setMovie(res.data))
      .catch(() => alert("Failed to load movie details"));
  }, [id]);

  const submitReview = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("You must be logged in to submit a review.");

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/reviews`,
        {
          movieId: movie._id,
          review: reviewText,
          rating: parseInt(rating),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Review submitted!");
      setReviewText("");
      setRating("");
      window.location.reload(); // Refresh to show updated reviews
    } catch {
      alert("Error submitting review.");
    }
  };

  if (!movie) return <p>Loading...</p>;

  return (
    <div>
      <h2>{movie.title}</h2>
      <img src={movie.imageUrl} alt={movie.title} width="200" />
      <p>Genre: {movie.genre}</p>
      <p>Average Rating: {movie.avgRating?.toFixed(1) || "No reviews yet"}</p>

      <h3>Reviews:</h3>
      <ul>
        {movie.reviews?.map((r, i) => (
          <li key={i}>
            <strong>{r.username}</strong>: {r.rating}/5 – {r.review}
          </li>
        ))}
      </ul>

      <h3>Leave a Review</h3>
      <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Your review" />
      <br />
      <input
        type="number"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        placeholder="Rating 1–5"
        min="1"
        max="5"
      />
      <br />
      <button onClick={submitReview}>Submit Review</button>
    </div>
  );
}

export default MovieDetailPage;

