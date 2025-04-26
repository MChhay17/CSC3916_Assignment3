import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function MovieListPage() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    axios
      .get(`${process.env.REACT_APP_API_URL}/movies?reviews=true`, {
        headers: { Authorization: `JWT ${token}` }
      })
      .then((res) => {
        console.log("✅ Movie data loaded:", res.data); // log for debugging
        setMovies(res.data);
      })
      .catch((err) => {
        console.error("❌ Failed to load movies:", err);
        setError("Unauthorized or error loading movies");
      });
  }, [navigate]);

  return (
    <div>
      <h2>Top Rated Movies</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {movies.length === 0 ? (
        <p>No movies found.</p>
      ) : (
        movies.map((movie) => (
          <div key={movie._id}>
            <img src={movie.imageURL} alt={movie.title} width="150" />
            <h3>{movie.title}</h3>
            <p>Avg Rating: {movie.avgRating?.toFixed(1) || "No reviews yet"}</p>
            <Link to={`/movies/${movie._id}`}>View Details</Link>
          </div>
        ))
      )}
    </div>
  );
}

export default MovieListPage;




