import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function MovieListPage() {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    axios
      .get(`${process.env.REACT_APP_API_URL}/movies?reviews=true`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setMovies(res.data))
      .catch(() => alert("Unauthorized or error loading movies"));
  }, [navigate]);

  return (
    <div>
      <h2>Top Rated Movies</h2>
      {movies.map((movie) => (
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


