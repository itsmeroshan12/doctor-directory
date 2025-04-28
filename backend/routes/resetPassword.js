const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/db'); // Import the db connection (pool)
const router = express.Router();

// POST: Reset password route
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params; // Extract token from URL
  const { password } = req.body; // Extract new password from body

  try {
    // Query to find the user using the reset token
    const query = "SELECT * FROM users WHERE reset_token = ?";
    const [results] = await db.execute(query, [token]); // Use db.execute with await for promise resolution

    const user = results[0]; // Assuming results is an array

    if (!user) {
      return res.status(404).json({ message: 'Invalid or expired reset token' });
    }

    // Check if the reset token has expired
    if (user.reset_token_expiration < Date.now()) {
      return res.status(400).json({ message: 'Reset token has expired' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user record with the new password and clear the reset token
    const updateQuery = "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiration = NULL WHERE reset_token = ?";

    // Use db.execute to run the update query
    await db.execute(updateQuery, [hashedPassword, token]);

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ message: 'Something went wrong. Please try again later.' });
  }
});

module.exports = router;
