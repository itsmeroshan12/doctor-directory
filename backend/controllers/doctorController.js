const db = require("../config/db");

// Slugify helper
const slugify = (text) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// Get all doctors
exports.getDoctors = async (req, res) => {
  try {
    const [doctors] = await db.execute("SELECT * FROM doctors ORDER BY id DESC");
    const doctorsWithSlugs = doctors.map((doc) => ({
      ...doc,
      slug: slugify(doc.hospitalName),
    }));
    res.status(200).json(doctorsWithSlugs);
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
};

// Add new doctor
exports.addDoctor = async (req, res) => {
  try {
    const {
      hospitalName,
      doctorName,
      mobile,
      email,
      website,
      experience,
      specialization,
      category,
      description,
      address,
    } = req.body;

    const doctorImage = req.files?.doctorImage?.[0]?.filename || null;
    const hospitalImage = req.files?.hospitalImage?.[0]?.filename || null;

    if (!hospitalName || !doctorName || !mobile || !email || !experience || !specialization || !category || !description || !address) {
      return res.status(400).json({ error: "All required fields must be filled" });
    }

    const sql = `
      INSERT INTO doctors (
        hospitalName, doctorName, mobile, email, website,
        experience, specialization, category,
        doctorImage, hospitalImage, description, address
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      hospitalName,
      doctorName,
      mobile,
      email,
      website || null,
      experience,
      specialization,
      category,
      doctorImage,
      hospitalImage,
      description,
      address,
    ];

    await db.execute(sql, values);
    res.status(201).json({ message: "Doctor added successfully" });
  } catch (err) {
    console.error("Error adding doctor:", err);
    res.status(500).json({ error: "Failed to add doctor" });
  }
};

// Get doctor by slug
exports.getDoctorBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const [rows] = await db.execute("SELECT * FROM doctors");
    const doctor = rows.find(
      (doc) => slugify(doc.hospitalName) === slug
    );
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });
    res.status(200).json(doctor);
  } catch (err) {
    console.error("Error fetching doctor by slug:", err);
    res.status(500).json({ error: "Failed to fetch doctor details" });
  }
};

// ✅ Get doctor by ID
exports.getDoctorById = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM doctors WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Doctor not found" });
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Error fetching doctor:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update doctor by ID
exports.updateDoctorById = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      hospitalName,
      doctorName,
      mobile,
      email,
      website,
      experience,
      specialization,
      category,
      description,
      address,  
    } = req.body;

    const doctorImage = req.files?.doctorImage?.[0]?.filename;
    const hospitalImage = req.files?.hospitalImage?.[0]?.filename;

    const fieldsToUpdate = {
      hospitalName,
      doctorName,
      mobile,
      email,
      website,
      experience,
      specialization,
      category,
      description,
      address,
    };

    if (doctorImage) fieldsToUpdate.doctorImage = doctorImage;
    if (hospitalImage) fieldsToUpdate.hospitalImage = hospitalImage;

    const keys = Object.keys(fieldsToUpdate);
    const values = Object.values(fieldsToUpdate);

    const sql = `
      UPDATE doctors
      SET ${keys.map((key) => `${key} = ?`).join(", ")}
      WHERE id = ?
    `;

    await db.execute(sql, [...values, id]);

    res.status(200).json({ message: "Doctor updated successfully" });
  } catch (err) {
    console.error("Error updating doctor:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Delete doctor by ID (NEW FUNCTIONALITY)
exports.deleteDoctorById = async (req, res) => {
  try {
    const doctorId = req.params.id;  // Get the doctor ID from the URL parameter

    // SQL query to delete a doctor by ID
    const deleteQuery = "DELETE FROM doctors WHERE id = ?";

    // Execute the query
    const [result] = await db.execute(deleteQuery, [doctorId]);

    if (result.affectedRows === 0) {
      // If no rows were affected, doctor not found
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Successfully deleted doctor
    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (err) {
    console.error("Error deleting doctor:", err);
    res.status(500).json({ message: "Error deleting doctor" });
  }
};
