require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

const doctorRoutes = require("./routes/doctorRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const db = require("./config/db");

const forgotPasswordRoutes = require("./routes/forgotPassword");
const resetPasswordRouter = require("./routes/resetPassword");

const app = express();

// ✅ Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://3.110.47.184"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ API Routes
app.use("/api/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/auth", authRoutes);
app.use("/auth", forgotPasswordRoutes);
app.use("/user", resetPasswordRouter);

// ✅ Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Health check
app.get("/", (req, res) => {
  res.send("Doctor Directory API is working");
});

// ✅ Serve frontend React build (production)
app.use(express.static(path.join(__dirname, "public")));
app.get(/^\/(?!api|auth|uploads).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
});
