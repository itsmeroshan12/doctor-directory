const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads folder exists
const uploadPath = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Invalid file type. Only images are allowed."));
  },
});

// ===== ROUTES =====

// GET all doctors
router.get("/", doctorController.getDoctors);

// GET latest 9 doctors
router.get("/latest", doctorController.getLatestDoctors);

// GET doctors created by logged-in user
router.get("/user/items", authMiddleware, doctorController.getUserDoctors);

// GET doctor by slug — placed before ID to avoid conflict
router.get("/slug/:slug", doctorController.getDoctorBySlug);

// GET doctor by ID
router.get("/:id", doctorController.getDoctorById);

// POST a new doctor (protected)
router.post(
  "/",
  upload.fields([
    { name: "doctorImage", maxCount: 1 },
    { name: "hospitalImage", maxCount: 1 },
  ]),
  authMiddleware,
  doctorController.addDoctor
);

// PUT update doctor by ID (protected)
router.put(
  "/:id",
  upload.fields([
    { name: "doctorImage", maxCount: 1 },
    { name: "hospitalImage", maxCount: 1 },
  ]),
  authMiddleware,
  doctorController.updateDoctorById
);

// DELETE a doctor by ID (protected)
router.delete("/:id", authMiddleware, doctorController.deleteDoctorById);



module.exports = router;
