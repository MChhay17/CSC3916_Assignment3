import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReviewForm from "./ReviewForm";

const API_URL = process.env.REACT_APP_API_URL;

const MovieDetailPage = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState("");

  const fetchMovie = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/movies/${movieId}?reviews=true`, {
        headers: { Authorization: token },
      });
      setMovie(response.data);
    } catch (err) {
      setError("Failed to load movie");
    }
  };

  useEffect(() => {
    fetchMovie();
  }, [movieId]);

  if (error) return <p>{error}</p>;
  if (!movie) return <p>Loading...</p>;

  return (
    <div>
      <h2>{movie.title}</h2>
      <img src={movie.imageURL} alt={movie.title} width="200" />
      <p>Genre: {movie.genre}</p>
      <p>Release Date: {movie.releaseDate}</p>
      <p>Average Rating: {movie.avgRating?.toFixed(1) || "N/A"}</p>

      <ReviewForm movieId={movie._id} onReviewSubmit={fetchMovie} />

      <h3>Reviews:</h3>
      {movie.reviews?.length > 0 ? (
        movie.reviews.map((r) => (
          <div key={r._id} style={{ marginBottom: "1em" }}>
            <strong>{r.username}</strong> rated it {r.rating}/5<br />
            {r.review}
          </div>
        ))
      ) : (
        <p>No reviews yet.</p>
      )}
    </div>
  );
};

export default MovieDetailPage;



