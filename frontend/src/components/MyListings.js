import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";
import { Button, Modal } from "react-bootstrap";


const MyListings = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // 🔐 Check if user is logged in
  const checkAuth = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/check", {
        withCredentials: true,
      });
      if (!res.data.loggedIn) {
        navigate("/");
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      navigate("/"); // Redirect if check fails
    }
  };

  const fetchUserDoctors = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/doctors/user/items", {
        withCredentials: true,
      });
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching user's doctors:", error);
      toast.error("Failed to fetch your doctor listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();         // 🔐 first check login
    fetchUserDoctors();  // then fetch if logged in

    if (location.state?.edited) {
      toast.success(location.state.message || "Doctor updated successfully!");
      window.history.replaceState({}, document.title);
    }
  }, []);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/doctors/${selectedDoctorId}`, {
        withCredentials: true,
      });
      toast.success("Doctor deleted successfully!");
      setDoctors(doctors.filter((doctor) => doctor.id !== selectedDoctorId));
      setShowConfirmModal(false);
    } catch (error) {
      console.error("Error deleting doctor:", error);
      toast.error("Failed to delete doctor");
      setShowConfirmModal(false);
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="container my-5">
        <div className="d-flex justify-content-start mb-3">
          <button className="btn btn-secondary" onClick={() => navigate("/")}>⬅️ Back to Home</button>
        </div>
        <h2 className="text-center text-primary mb-4">My Doctor Listings</h2>

        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : doctors.length === 0 ? (
          <div className="alert alert-info text-center">You have not added any doctors yet.</div>
        ) : (
          <div className="row">
            {doctors.map((doctor) => (
              <div className="col-md-4 mb-4" key={doctor.id}>
                <div className="card h-100 shadow-sm p-2 position-relative">
                  <div className="position-absolute top-0 end-0 p-2 text-muted small">
                    {new Date(doctor.created_at).toLocaleDateString("en-IN")}
                  </div>
                  <div className="d-flex align-items-start">
                    <img
                      src={`http://localhost:5000/uploads/${doctor.hospitalImage || "default-image.jpg"}`}
                      alt={doctor.hospitalName}
                      className="rounded me-3"
                      style={{ width: "80px", height: "80px", objectFit: "cover" }}
                    />
                    <div>
                      <h5 className="mb-1">{doctor.hospitalName}</h5>
                      <p className="mb-1"><strong>Doctor:</strong> {doctor.doctorName}</p>
                      <p className="mb-1"><strong>Specialization:</strong> {doctor.specialization}</p>
                      <p className="mb-2"><strong>Category:</strong> {doctor.category}</p>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => navigate(`/hospitals/${doctor.slug}`)}
                        >
                          View Details
                        </button>
                        <button
                          className="btn btn-sm btn-outline-warning"
                          onClick={() => navigate(`/hospitals/edit/${doctor.slug}`)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => {
                            setSelectedDoctorId(doctor.id);
                            setShowConfirmModal(true);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this doctor?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MyListings;
