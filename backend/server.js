require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser"); // move it above

const doctorRoutes = require("./routes/doctorRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require('./routes/userRoutes');
const db = require("./config/db");

const forgotPasswordRoutes = require('./routes/forgotPassword'); // ✅ Import forgot password route
const resetPasswordRouter = require('./routes/resetPassword'); // ✅ Import reset password route

const app = express();

// ✅ Middleware
app.use(cors({
  origin: "http://localhost:3000", // your React app's URL
  credentials: true // Allow cookies to be sent
}));
app.use(cookieParser()); // must be immediately after cors
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Register routes
app.use("/api/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);

// forgot password Route 
app.use('/auth', forgotPasswordRoutes);  // Now available at /auth/forgot-password

// reset password Route
app.use('/user', resetPasswordRouter); 

// ✅ Static folder for uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Default API Status
app.get("/", (req, res) => {
  res.send("Doctor Directory API is working");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
