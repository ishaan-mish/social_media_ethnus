import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../cssStyles/styles.css';

function LoginForm({ shiftContainer }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userid: formData.username,
          password: formData.password
        })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate('/home');
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="authFormBox">
      <h2>Welcome Back</h2>
      <div className="authTypeContainer">Login to Your Account</div>

      <form onSubmit={handleSubmit}>
        <div className="inputGroup">
          <i className="fas fa-user"></i>
          <input type="text" name="username" placeholder="User ID" value={formData.username} onChange={handleInputChange} required />
        </div>
        <div style={{ margin: 30 }}></div>
        <div className="inputGroup">
          <i className="fas fa-lock"></i>
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} required />
        </div>

        <button className="authBtn" type="submit" disabled={isLoading}>
          {isLoading ? 'LOGGING IN...' : 'LOG IN'}
        </button>

        {isLoading && (
          <div className="loadingSpinner">
            <i className="fas fa-spinner"></i> Authenticating your credentials...
          </div>
        )}
      </form>

      <div className="switchLink">
        Don't have an account? <a href="#" onClick={shiftContainer}>Sign up</a>
      </div>
    </div>
  );
}

export default LoginForm;
