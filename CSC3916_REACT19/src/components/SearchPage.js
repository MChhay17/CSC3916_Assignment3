import { useState } from "react";
import axios from "axios";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const search = async () => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/movies/search`, { query }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    setResults(res.data);
  };

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by movie or actor" />
      <button onClick={search}>Search</button>
      {results.map(m => (
        <div key={m._id}>
          <img src={m.imageUrl} width="100" alt={m.title} />
          <p>{m.title}</p>
        </div>
      ))}
    </div>
  );
}

export default SearchPage;
