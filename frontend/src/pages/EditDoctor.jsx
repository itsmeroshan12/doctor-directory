import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Button, Container, Card, Modal } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const EditDoctor = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editCategory, setEditCategory] = useState(false);
  const [doctorImageFile, setDoctorImageFile] = useState(null);
  const [hospitalImageFile, setHospitalImageFile] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const categories = [
    "Cardiology", "Orthopedics", "Dermatology", "Gynecology",
    "Neurology", "Pediatrics", "Dentistry", "General Surgery",
    "ENT", "Psychiatry"
  ];

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/doctors/slug/${slug}`);
        setDoctor(res.data);
      } catch (err) {
        console.error("Error fetching doctor details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [slug]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDoctor({ ...doctor, [name]: value });

    if (name === "doctorName" && !doctor.slug) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setDoctor({ ...doctor, slug: generatedSlug });
    }
  };

  const handleUpdate = async () => {
    if (!doctor || !doctor.id) {
      toast.error("Doctor ID is missing");
      return;
    }

    // Validate mobile number
    if (!/^\d{10}$/.test(doctor.mobile)) {
      toast.error("Mobile number must be exactly 10 digits");
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(doctor).forEach(([key, value]) => {
        formData.append(key, value);  
      });

      if (doctorImageFile) formData.append("doctorImage", doctorImageFile);
      if (hospitalImageFile) formData.append("hospitalImage", hospitalImageFile);

      // Get the token from localStorage or wherever you're storing it
      const token = localStorage.getItem("jwtToken");

      // Make the PUT request with the Authorization header containing the token
      await axios.put(`http://localhost:5000/api/doctors/${doctor.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`,  // Include the token in the Authorization header
        },
      });

      toast.success("Doctor details updated successfully!");
      setTimeout(() => navigate("/hospitals"), 2000);
    } catch (err) {
      console.error("Error updating doctor:", err);
      toast.error("Update failed. Please check the console for more details.");
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setShowModal(true); // open confirmation modal
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!doctor) return <div className="text-center mt-5">Doctor not found</div>;

  return (
    <Container className="mt-5">
      <Card className="p-4 shadow">
        <h2 className="mb-4">Edit Doctor Details</h2>
        <Form onSubmit={handleFormSubmit} encType="multipart/form-data">
          <Form.Group className="mb-3">
            <Form.Label>Hospital Name</Form.Label>
            <Form.Control
              type="text"
              name="hospitalName"
              value={doctor.hospitalName}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Doctor Name</Form.Label>
            <Form.Control
              type="text"
              name="doctorName"
              value={doctor.doctorName}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Slug (Auto-generated)</Form.Label>
            <Form.Control
              type="text"
              name="slug"
              value={doctor.slug || ""}
              readOnly
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Specialization</Form.Label>
            <Form.Control
              type="text"
              name="specialization"
              value={doctor.specialization}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            {!editCategory ? (
              <div className="d-flex align-items-center gap-3">
                <Form.Control plaintext readOnly value={doctor.category} />
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => setEditCategory(true)}
                >
                  Edit
                </Button>
              </div>
            ) : (
              <Form.Select
                name="category"
                value={doctor.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Form.Select>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Experience (years)</Form.Label>
            <Form.Control
              type="number"
              name="experience"
              value={doctor.experience}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mobile</Form.Label>
            <Form.Control
              type="text"
              name="mobile"
              value={doctor.mobile}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={doctor.email}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Website</Form.Label>
            <Form.Control
              type="text"
              name="website"
              value={doctor.website || ""}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="address"
              value={doctor.address}
              onChange={handleInputChange}
              />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={doctor.description}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Doctor Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => setDoctorImageFile(e.target.files[0])}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Hospital Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => setHospitalImageFile(e.target.files[0])}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Update Doctor Details
          </Button>
        </Form>
      </Card>

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to update the doctor details?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => {
            setShowModal(false);
            handleUpdate();
          }}>
            Yes, Update
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-right" autoClose={3000} />
    </Container>
  );
};

export default EditDoctor;
