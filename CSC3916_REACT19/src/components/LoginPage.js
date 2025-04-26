import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/signin`,
        formData
      );

      // ✅ Force "JWT " prefix if not already included
      const token = res.data.token.includes("JWT ")
        ? res.data.token
        : `JWT ${res.data.token}`;

      localStorage.setItem("token", token);
      alert("Login successful!");
      navigate("/movies");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Check your credentials.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        name="username"
        placeholder="Username"
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        required
      />
      <button type="submit">Log In</button>
    </form>
  );
}

export default LoginPage;








