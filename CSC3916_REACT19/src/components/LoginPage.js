const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/signin`, formData);

    if (res.data && res.data.token) {
      // Strip 'JWT ' prefix from token
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

