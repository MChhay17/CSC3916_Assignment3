import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function MovieDetailPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/movies/${id}?reviews=true`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => setMovie(res.data)).catch(err => console.error(err));
  }, [id]);

  if (!movie) return <p>Loading...</p>;

  return (
    <div>
      <img src={movie.imageUrl} alt={movie.title} width="200" />
      <h2>{movie.title}</h2>
      <p>Genre: {movie.genre}</p>
      <p>Release Year: {movie.releaseDate}</p>
      <p>Avg Rating: {movie.avgRating?.toFixed(1)}</p>
      <h3>Actors</h3>
      <ul>{movie.actors.map((a, i) => <li key={i}>{a.actorName} as {a.characterName}</li>)}</ul>
      <h3>Reviews</h3>
      <ul>{movie.movieReviews.map((r, i) => (
        <li key={i}><strong>{r.username}:</strong> {r.rating} - {r.review}</li>
      ))}</ul>
    </div>
  );
}

export default MovieDetailPage;
