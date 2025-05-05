import React from 'react';
import './Footer.css';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white text-center py-4">
      <div className="container">
        <p className="mb-2">&copy; {new Date().getFullYear()} DoctorDirectory</p>
        <div className="footer-links mb-2">
          <a href="/">Home</a>
          <a href="/Hospitals">View Listings</a>
          <a href="/user/login">Login</a>
        </div>
        <div className="social-icons">
          <a href="#"><FaFacebook /></a>
          <a href="#"><FaTwitter /></a>
          <a href="#"><FaInstagram /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
