require('dotenv').config();
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token; // ✅ Read from cookie directly
  console.log("Token from Cookie:", token);

  if (!token) {
    return res.status(403).json({ message: "Access denied, token missing." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);
    req.user = {
      id: decoded.id, // ⬅️ Ensure `id` field exists for downstream use
      email: decoded.email
    };
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = authMiddleware;
