import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://csc3916-assignment3-1-fnrr.onrender.com/movies?reviews=true';

const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) {
    return 'N/A';
  }
  const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
  const avg = sum / reviews.length;
  // Return average to one decimal place (as a string, e.g. "4.5")
  return avg.toFixed(1);
};

const MovieListPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError('');
      try {
        // Retrieve JWT token from localStorage
        const token = localStorage.getItem('token');
        console.log('JWT token:', token);
        if (!token) {
          // If no token found, set an unauthorized error message
          setError('Unauthorized: No token found. Please log in.');
          return;
        }

        // Make GET request to fetch movies with Authorization header
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Fetched movies data:', response.data);

        // Set movies state with fetched data (assuming response.data is an array of movies)
        setMovies(response.data || []);
      } catch (err) {
        console.error('Error fetching movies:', err);
        if (err.response && err.response.status === 401) {
          // Handle Unauthorized (401) specifically
          setError('Unauthorized. Please log in to view movies.');
        } else {
          // Handle other errors (network issues, server errors, etc.)
          setError('Failed to load movies.');
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

      {!loading && error && (
        <p style={{ color: 'red' }}>{error}</p>
      )}

      {!loading && !error && movies.length === 0 && (
        <p>No movies found.</p>
      )}

      {!loading && !error && movies.length > 0 && (
        <div className="movies-list">
          {movies.map(movie => {
            const avgRating = calculateAverageRating(movie.reviews);
            return (
              <div key={movie._id} className="movie-item" style={{ marginBottom: '1em' }}>
                <h3>{movie.title}</h3>
                {movie.image && (
                  <img 
                    src={movie.image} 
                    alt={movie.title} 
                    style={{ maxWidth: '200px', height: 'auto', display: 'block' }} 
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





