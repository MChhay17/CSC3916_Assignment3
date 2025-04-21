import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function MovieListPage() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/movies?reviews=true`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }).then(res => setMovies(res.data)).catch(err => alert("Unauthorized or error loading movies"));
  }, []);

  return (
    <div>
      <h2>Top Rated Movies</h2>
      {movies.map(movie => (
        <div key={movie._id}>
          <img src={movie.imageUrl} alt={movie.title} width="150" />
          <h3>{movie.title}</h3>
          <p>Avg Rating: {movie.avgRating?.toFixed(1) || "No reviews yet"}</p>
          <Link to={`/movies/${movie._id}`}>View Details</Link>
        </div>
      ))}
    </div>
  );
}

export default MovieListPage;
