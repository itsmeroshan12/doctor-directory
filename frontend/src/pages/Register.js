import React, { useState } from 'react';
import axios from 'axios';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const validatePhone = (phone) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(phone);
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{6,20}$/;
    return regex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    if (!validatePhone(formData.phone)) {
      toast.error('Please enter a valid 10-digit phone number.');
      return;
    }

    if (!validatePassword(formData.password)) {
      toast.error('Password must contain at least one number and one special character.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/user/register', formData);
      setLoading(false);

      if (response.data.message) {
        toast.success(response.data.message || 'Registration successful!');
        setTimeout(() => {
          navigate('/user/login');
        }, 2000);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error registering:', error);
      const errorMsg = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMsg);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container mt-5 mb-5">
      <ToastContainer />
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg p-4 rounded-4">
            <h2 className="text-center text-primary mb-4">Register a New Account</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label"><FaUser /> Name *</label>
                <div className="d-flex">
                  <input
                    type="text"
                    className="form-control"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    required
                  />
                  <input
                    type="text"
                    className="form-control ms-2"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label"><FaEnvelope /> E-mail *</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="youremail@domain.com"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label"><FaPhone /> Mobile Phone *</label>
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label"><FaLock /> Password *</label>
                <div className="position-relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="YourPassword123"
                    required
                  />
                  <span
                    className="position-absolute"
                    style={{ top: '50%', right: '10px', transform: 'translateY(-50%)', cursor: 'pointer' }}
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label"><FaLock /> Re-type Password *</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter YourPassword123"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? 'Loading...' : 'Create Account'}
              </button>

              <p className="text-center mt-3">
                Already have an account?{' '}
                <a href="/user/login" className="text-decoration-none text-primary">
                  Log in
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Mobile Only Back to Home Button */}
      <div className="d-md-none position-fixed bottom-0 start-0 end-0 bg-light py-2 border-top text-center">
        <button className="btn btn-outline-primary w-75" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export default Register;
