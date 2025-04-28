const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findUserByEmail } = require('../models/userModel');

router.post('/login', async (req, res) => {
  try {
    console.log('✅ Received login request');
    const { email, password } = req.body;
    console.log('📦 Request Body:', req.body);

    // 1. Find user in the database
    console.log('🔍 Querying database for email:', email);
    const user = await findUserByEmail(email);
    console.log('🔍 findUserByEmail result:', user);

    if (!user) {
      console.log('❌ User not found');
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('🔐 Password match:', isMatch);  // Log password match result
    console.log('Entered Password:', password);  // Log entered password
    console.log('Stored Hashed Password:', user.password);  // Log stored hashed password

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
      sameSite: 'Lax', // You can change to 'Strict' or 'None' later
      secure: false,    // true only if HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // 5. Send response
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

module.exports = router;
