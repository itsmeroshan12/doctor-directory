// userModel.js or similar
const db = require('../config/db');  // Make sure you're importing db here

// In models/userModel.js
const findUserByEmail = async (email) => {
  console.log('🔍 Querying database for email:', email);  // Ensure this log is seen
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    console.log('🔍 Query result:', rows);  // This will show the result of the query
    return rows.length > 0 ? rows[0] : null;  // If no rows, return null
  } catch (err) {
    console.error('Database query error:', err);  // Log any errors from the query
    throw err;  // Rethrow the error to handle it in the route
  }
};




module.exports = { findUserByEmail };
