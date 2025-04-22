const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads folder exists
const uploadPath = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// ===== ROUTES =====

// GET all doctors
router.get("/", doctorController.getDoctors);

// POST a new doctor
router.post(
  "/",
  upload.fields([
    { name: "doctorImage", maxCount: 1 },
    { name: "hospitalImage", maxCount: 1 },
  ]),
  doctorController.addDoctor
);

// GET doctor by slug
router.get("/slug/:slug", doctorController.getDoctorBySlug);

// GET doctor by ID
router.get("/:id", doctorController.getDoctorById);

// PUT update doctor by ID
router.put(
  "/:id",
  upload.fields([
    { name: "doctorImage", maxCount: 1 },
    { name: "hospitalImage", maxCount: 1 },
  ]),
  doctorController.updateDoctorById
);

// DELETE a doctor by ID (NEW ROUTE)
router.delete("/:id", doctorController.deleteDoctorById);

module.exports = router;
