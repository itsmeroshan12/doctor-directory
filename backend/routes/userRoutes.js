const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../config/db'); 
const { findUserByEmail } = require('../models/userModel');
const authMiddleware = require('../middleware/authMiddleware'); // Import the auth middleware

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // safer

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, confirmPassword } = req.body;

    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.status(400).json({ success: false, message: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO users (firstName, lastName, email, phone, password) VALUES (?, ?, ?, ?, ?)',
      [firstName, lastName, email, phone, hashedPassword]
    );

    return res.status(201).json({ success: true, message: 'User registered successfully!' });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    console.log('✅ Received login request');
    const { email, password } = req.body;
    console.log('📦 Request Body:', req.body);

    // 1. Find user
    const user = await findUserByEmail(email);
    console.log('🔎 findUserByEmail result:', user);

    if (!user) {
      console.log('❌ User not found');
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('🔐 Password match:', isMatch);  // Log password match result

    if (!isMatch) {
      console.log('❌ Password mismatch');
      return res.status(400).json({ success: false, message: 'Invalid password' });
    }

    // 3. Create token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    console.log('📝 JWT Token:', token);

    // 4. Send token inside cookie
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'Lax',
      secure: false, // Change to 'true' if deployed over HTTPS
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    // 5. Response
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
    console.log('✅ Login successful response sent');

  } catch (error) {
    console.error('🚨 Login Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get User's Items (Doctor Listings) - Authenticated route
router.get('/items', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Get the user ID from the token

    // Query to get doctor's listings for the logged-in user
    const [doctors] = await db.query('SELECT * FROM doctors WHERE user_id = ?', [userId]);

    if (doctors.length === 0) {
      return res.status(404).json({ success: false, message: 'No listings found for this user' });
    }

    return res.status(200).json({
      success: true,
      message: 'User listings retrieved successfully',
      listings: doctors,
    });
  } catch (error) {
    console.error("Error fetching user's listings:", error);
    return res.status(500).json({ success: false, message: 'Error fetching listings' });
  }
});

module.exports = router;
