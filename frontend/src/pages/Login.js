import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0); // Track login attempts
  const [showForgotPassword, setShowForgotPassword] = useState(false); // Show forgot password after 2 attempts
  const [forgotEmail, setForgotEmail] = useState(''); // Store the email for forgot password
  const [showResetForm, setShowResetForm] = useState(false); // Show reset form
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError(''); // Clear error when the user starts typing
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/auth/forgot-password', { email: forgotEmail });
      if (res.status === 200) {
        alert("Password reset link sent to your email!");
        setShowResetForm(false); // Hide the reset form after successful submission
      }
    } catch (err) {
      setError('Error sending reset link. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      const res = await axios.post('http://localhost:5000/auth/login', {
        email: credentials.email,
        password: credentials.password,
      }, { withCredentials: true });
  
      if (res.status === 200) {
        localStorage.setItem('token', res.data.token); // (optional if token is also in cookie)
        localStorage.setItem('firstName', res.data.user.firstName); // ✅ Save firstName here
        navigate('/');
      }
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      setAttempts((prevAttempts) => {
        const newAttempts = prevAttempts + 1;
        if (newAttempts >= 3) {
          setShowForgotPassword(true);
        }
        return newAttempts;
      });
    }
  };
  

  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: '#f1f3f6' }}>
      <div className="card shadow-lg p-4 rounded-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center text-primary mb-4">Welcome Back</h2>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        {!showResetForm ? (
          <form onSubmit={handleSubmit} noValidate>
            {/* Email Field */}
            <div className="form-group mb-3">
              <label className="form-label">Email address</label>
              <div className="input-group">
                <span className="input-group-text bg-primary text-white"><FaEnvelope /></span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group mb-4">
              <label className="form-label">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-primary text-white"><FaLock /></span>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter your password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100">Login</button>

            {showForgotPassword && (
              <div className="text-center mt-3">
                <small>
                  <a href="#" onClick={() => setShowResetForm(true)}>Forgot Password?</a>
                </small>
              </div>
            )}

            <div className="text-center mt-3">
              <small>Don't have an account? <a href="/user/register">Register here</a></small>
            </div>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword} noValidate>
            <h5 className="text-center mb-4">Reset Your Password</h5>

            <div className="form-group mb-3">
              <label className="form-label">Enter your email address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">Send Reset Link</button>

            <div className="text-center mt-3">
              <small>
                <a href="#" onClick={() => setShowResetForm(false)}>Back to Login</a>
              </small>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
