const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// Register a new user
const registerUser = (req, res) => {
  console.log('📦 Request Body:', req.body);

  const { firstName, lastName, email, phone, password, confirmPassword } = req.body;

  // Validate fields
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  // Check if user already exists
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (results.length > 0) return res.status(400).json({ message: "User already exists." });

    // Hash password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.status(500).json({ message: "Hashing error", error: err });

      // Insert user into database
      const query = "INSERT INTO users (firstName, lastName, email, phone, password) VALUES (?, ?, ?, ?, ?)";
      db.query(query, [firstName, lastName, email, phone, hashedPassword], (err, result) => {
        if (err) return res.status(500).json({ message: "Insert error", error: err });
        res.status(201).json({ message: "User registered successfully!" });
      });
    });
  });
};

// Login user and return JWT token
const loginUser = (req, res) => {
  const { email, password } = req.body;
  console.log("🔐 Login request received with email:", email);

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) {
      console.error("❌ DB error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    console.log("📦 User query results:", results);

    if (results.length === 0) {
      console.log("❗ No user found for email:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = results[0];
    console.log("🔐 Found user:", user.email);

    try {
      const match = await bcrypt.compare(password, user.password);
      console.log("🔑 Password match:", match);

      if (!match) {
        console.log("❌ Incorrect password for", email);
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION || "1h" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
        maxAge: 24 * 60 * 60 * 1000
      });

      console.log("✅ Login successful for", email);

      return res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          name: user.firstName
        }
      });
    } catch (bcryptErr) {
      console.error("❌ Bcrypt compare error:", bcryptErr);
      return res.status(500).json({ message: "Server error", error: bcryptErr });
    }
  });
};

module.exports = { registerUser, loginUser };
