import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/signin`, formData);
      if (res.data && res.data.token) {
        const rawToken = res.data.token.replace("JWT ", "");
        localStorage.setItem("token", rawToken);
        alert("Login successful!");
        navigate("/");
      } else {
        alert("Invalid login response from server.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Please check your username and password.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        name="username"
        type="text"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        required
      />
      <br />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <br />
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginPage;


