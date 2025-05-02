const db = require("../config/db");

// Slugify helper
const slugify = (text) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// ✅ Get doctors created by the logged-in user
exports.getUserDoctors = async (req, res) => {
  try {
    const userId = req.user.id; // Get user id from the JWT token (from the auth middleware)

    const [doctors] = await db.execute(
      "SELECT * FROM doctors WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );

    const doctorsWithSlugs = doctors.map((doc) => ({
      ...doc,
      slug: slugify(doc.hospitalName),
    }));

    res.status(200).json(doctorsWithSlugs); // Send the doctor's data with slugs
  } catch (err) {
    console.error("Error fetching user's doctors:", err);
    res.status(500).json({ error: "Failed to fetch your doctor listings" });
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

    const userId = req.user.id;

    const sql = `
      INSERT INTO doctors (
        hospitalName, doctorName, mobile, email, website,
        experience, specialization, category,
        doctorImage, hospitalImage, description, address, user_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      req.user.id,
    ];

    await db.execute(sql, values);
    res.status(201).json({ message: "Doctor added successfully" });
  } catch (err) {
    console.error("Error adding doctor:", err);
    res.status(500).json({ error: "Failed to add doctor" });
  }
};



// Controller to fetch all doctors and with 12 on each page
exports.getDoctors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 12;
    const offset = (page - 1) * limit;

    const [rows] = await db.execute(
      'SELECT * FROM doctors ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );

    const [countResult] = await db.execute('SELECT COUNT(*) as count FROM doctors');
    const total = countResult[0].count;
    const totalPages = Math.ceil(total / limit);

    res.json({ doctors: rows, totalPages, currentPage: page });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Server error' });
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

// Get doctor by ID
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

// Update doctor by ID
exports.updateDoctorById = async (req, res) => {
  try {
    const doctorId = req.params.id;

    // Step 1: Get current doctor entry to check ownership
    const [doctorResult] = await db.execute("SELECT user_id FROM doctors WHERE id = ?", [doctorId]);

    if (doctorResult.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const doctor = doctorResult[0];

    // Step 2: Check if logged-in user is the owner
    if (doctor.user_id !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to update this doctor" });
    }

    // Step 3: Prepare update data
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

    await db.execute(sql, [...values, doctorId]);

    res.status(200).json({ message: "Doctor updated successfully" });

  } catch (err) {
    console.error("Error updating doctor:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete doctor by ID
exports.deleteDoctorById = async (req, res) => {
  try {
    const doctorId = req.params.id;

    const deleteQuery = "DELETE FROM doctors WHERE id = ?";

    const [result] = await db.execute(deleteQuery, [doctorId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (err) {
    console.error("Error deleting doctor:", err);
    res.status(500).json({ message: "Error deleting doctor" });
  }
};

// Get the latest 9 doctors
exports.getLatestDoctors = async (req, res) => {
  try {
    const [doctors] = await db.execute("SELECT * FROM doctors ORDER BY id DESC LIMIT 9");

    if (doctors.length === 0) {
      return res.status(404).json({ message: "No doctors found" });
    }

    const doctorsWithSlugs = doctors.map((doctor) => ({
      ...doctor,
      slug: slugify(doctor.hospitalName),
    }));

    res.status(200).json(doctorsWithSlugs);
  } catch (err) {
    console.error("Error fetching latest doctors:", err);
    res.status(500).json({ error: "Failed to fetch the latest doctors" });
  }
};
