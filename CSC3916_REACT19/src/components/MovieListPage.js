import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://csc3916-assignment3-1-fnrr.onrender.com/movies?reviews=true';

const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) {
    return 'N/A';
  }
  const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
  const avg = sum / reviews.length;
  return avg.toFixed(1); // Return average rounded to 1 decimal place
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
        const token = localStorage.getItem('token');
        console.log('JWT token from storage:', token);

        if (!token) {
          setError('Unauthorized: No token found. Please log in.');
          return;
        }

        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `JWT ${token}` // ✅ Corrected here
          }
        });
        console.log('Fetched movies data:', response.data);

        setMovies(response.data || []);
      } catch (err) {
        console.error('Error fetching movies:', err);
        if (err.response && err.response.status === 401) {
          setError('Unauthorized. Please log in again.');
        } else {
          setError('Failed to load movies. Please try again later.');
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

      {error && !loading && (
        <p style={{ color: 'red' }}>{error}</p>
      )}

      {!loading && !error && movies.length === 0 && (
        <p>No movies found.</p>
      )}

      {!loading && !error && movies.length > 0 && (
        <div className="movies-list">
          {movies.map((movie) => {
            const avgRating = calculateAverageRating(movie.reviews);
            return (
              <div key={movie._id} className="movie-item" style={{ marginBottom: '1em' }}>
                <h3>{movie.title}</h3>
                {movie.imageURL && ( // Ensure you use correct property imageURL (capital URL)
                  <img 
                    src={movie.imageURL} 
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





