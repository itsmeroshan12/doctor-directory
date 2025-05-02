const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findUserByEmail } = require('../models/userModel');

// ✅ Middleware to verify JWT from cookies and attach user to req
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ loggedIn: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (error) {
    return res.status(401).json({ loggedIn: false, message: "Invalid token" });
  }
};

// ✅ Login Route
router.post('/login', async (req, res) => {
  try {
    console.log('✅ Received login request');
    const { email, password } = req.body;
    console.log('📦 Request Body:', req.body);

    const user = await findUserByEmail(email);
    console.log('🔍 findUserByEmail result:', user);

    if (!user) {
      console.log('❌ User not found');
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('🔐 Password match:', isMatch);

    if (!isMatch) {
      console.log('❌ Password mismatch');
      return res.status(400).json({ success: false, message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'Lax',
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error('🚨 Login Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ✅ Check login status route
router.get("/check", verifyToken, (req, res) => {
  res.json({ loggedIn: true, user: req.user });
});

// ✅ Logout Route
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "Lax",
    secure: false, // Set to true in production with HTTPS
  });
  res.json({ success: true, message: "Logged out successfully" });
});

module.exports = router;  
