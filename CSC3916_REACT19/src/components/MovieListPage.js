import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://csc3916-assignment3-1-fnrr.onrender.com/movies?reviews=true';

const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 'N/A';
  const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
  return (sum / reviews.length).toFixed(1);
};

const MovieListPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      const token = localStorage.getItem('token');
      console.log("📦 JWT Token from localStorage:", token);

      if (!token) {
        setError('Unauthorized: No token found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `${token}` // ✅ token already includes "JWT " prefix
          }
        });

        console.log("🎬 Movie data loaded:", response.data);
        setMovies(response.data || []);
      } catch (err) {
        console.error("❌ Failed to load movies:", err);
        if (err.response && err.response.status === 401) {
          setError('Unauthorized. Please log in again.');
        } else {
          setError('Error loading movies. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div>
      <h1>Top Rated Movies</h1>

      {loading && <p>Loading movies...</p>}
      {!loading && error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && movies.length === 0 && <p>No movies found.</p>}

      {!loading && !error && movies.length > 0 && (
        <div className="movies-list">
          {movies.map((movie) => {
            const avgRating = calculateAverageRating(movie.reviews);
            return (
              <div key={movie._id} style={{ marginBottom: '1.5em' }}>
                <h3>{movie.title}</h3>
                {movie.imageURL && (
                  <img
                    src={movie.imageURL}
                    alt={movie.title}
                    style={{ width: '200px', height: 'auto', display: 'block' }}
                  />
                )}
                <p>Average Rating: {avgRating}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MovieListPage;





