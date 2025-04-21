import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import MovieListPage from './components/MovieListPage';
import MovieDetailPage from './components/MovieDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MovieListPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/movies/:id" element={<MovieDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;