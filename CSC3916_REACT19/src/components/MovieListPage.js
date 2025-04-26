import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

const MovieListPage = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/movies?reviews=true`, {
          headers: { Authorization: token },
        });
        setMovies(response.data);
      } catch (err) {
        setError("Unauthorized or error loading movies");
      }
    };
    fetchMovies();
  }, []);

  return (
    <div>
      <h1>Top Rated Movies</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {movies.map((movie) => (
        <div key={movie._id} style={{ marginBottom: "1em" }}>
          <h3>
            <Link to={`/movies/${movie._id}`}>{movie.title}</Link>
          </h3>
          {movie.imageURL && (
            <img src={movie.imageURL} alt={movie.title} width="150" />
          )}
          <p>Average Rating: {movie.avgRating?.toFixed(1) || "N/A"}</p>
        </div>
      ))}
    </div>
  );
};

export default MovieListPage;






