const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const pool = require('../config/db'); // ✅ your MySQL2 pool/connection
const router = express.Router();

// Setup your email transport (using Gmail for example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'khobragadetanay2@gmail.com',   // ✅ replace with your Gmail
    pass: 'zsqjpclzsfsioijd',      // ✅ App Password (not normal Gmail password)
  },
});

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    // 1. Check if the user exists
    const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];

    // 2. Generate a reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiration = Date.now() + 3600000; // 1 hour from now

    // 3. Save reset token and expiration to database
    await pool.execute(
      'UPDATE users SET reset_token = ?, reset_token_expiration = ? WHERE id = ?',
      [resetToken, resetTokenExpiration, user.id]
    );

    const resetUrl = `http://localhost:3000/user/reset-password/${resetToken}`;

    // 4. Send the email
    await transporter.sendMail({
      to: email,
      subject: 'Password Reset Request',
      text: `You requested to reset your password. Click the link below to reset:\n\n${resetUrl}\n\nThis link will expire in 1 hour.`,
    });

    res.status(200).json({ message: 'Password reset link sent to your email' });

  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ message: 'Something went wrong, please try again' });
  }
});

module.exports = router;
