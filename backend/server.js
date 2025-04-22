const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const doctorRoutes = require("./routes/doctorRoutes");
const db = require("./config/db"); // Make sure this connects to your DB properly

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/doctors", doctorRoutes);

// Root endpoint to verify server is working
app.get("/", (req, res) => {
  res.send("Doctor Directory API is working");
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});