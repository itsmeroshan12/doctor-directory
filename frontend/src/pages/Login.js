import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError('');
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Sending reset link...");
    try {
      const res = await axios.post('http://localhost:5000/auth/forgot-password', { email: forgotEmail });
      if (res.status === 200) {
        toast.update(loadingToast, {
          render: "Password reset link sent!",
          type: "success",
          isLoading: false,
          autoClose: 5000
        });
        setShowResetForm(false);
      }
    } catch (err) {
      toast.update(loadingToast, {
        render: "Error sending reset link. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 5000
      });
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
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('firstName', res.data.user.firstName);
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
                  type={passwordVisible ? "text" : "password"}
                  className="form-control"
                  placeholder="Enter your password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
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

      {/* Mobile Only Back to Home Button */}
      <div className="d-md-none position-fixed bottom-0 start-0 end-0 bg-light py-2 border-top text-center">
        <button className="btn btn-outline-primary w-75" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default Login;
