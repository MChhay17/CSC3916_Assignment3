import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReviewForm from './ReviewForm'; // 👈 Import ReviewForm!

function MovieDetailPage() {
  const { movieId } = useParams(); // ✅ Get movieId from the URL params
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/movies/${movieId}?reviews=true`,
          {
            headers: {
              Authorization: token,
              'Content-Type': 'application/json'
            }
          }
        );
        setMovie(response.data);
      } catch (err) {
        console.error('❌ Error fetching movie detail:', err);
        setError('Failed to load movie.');
      }
    };

    fetchMovie();
  }, [movieId]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!movie) return <p>Loading movie details...</p>;

  return (
    <div>
      <h2>{movie.title}</h2>
      {movie.imageURL && (
        <img src={movie.imageURL} alt={movie.title} style={{ width: '200px' }} />
      )}
      <p>Genre: {movie.genre}</p>
      <p>Release Date: {movie.releaseDate}</p>

      <h3>Average Rating: {movie.avgRating?.toFixed(1) || 'No reviews yet'}</h3>

      {/* ✅ Add the Review Form */}
      <ReviewForm movieId={movie._id} />

      {/* ✅ Show existing reviews */}
      <div style={{ marginTop: '2em' }}>
        <h3>Reviews:</h3>
        {movie.reviews && movie.reviews.length > 0 ? (
          movie.reviews.map((review) => (
            <div key={review._id} style={{ marginBottom: '1em' }}>
              <strong>User:</strong> {review.username}<br />
              <strong>Rating:</strong> {review.rating}<br />
              <strong>Comment:</strong> {review.review}
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
}

export default MovieDetailPage; // ✅ Export it properly


