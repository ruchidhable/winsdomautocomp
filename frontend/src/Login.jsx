import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Required for navigation
import './Login.css'; // Keep your custom CSS

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, password } = formData;

    if (username === 'admin' && password === 'admin123') {
      navigate('/qaform'); // Route to QaFormPage
    } else {
      alert('Login failed!\nInvalid username or password.');
    }
  };

return (
  <div className="login-container">
    <div className="login-box">
      <div className="branding-panel">
        <h1>Winsdom Autocomp</h1>
        <p>QA Login Panel</p>
      </div>
      <div className="form-panel">
        <h2>Welcome Back!</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="options">
            <label>
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
              />
              Remember me
            </label>
            <a href="#">Forgot Password?</a>
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>
  </div>
);
}

export default Login;
