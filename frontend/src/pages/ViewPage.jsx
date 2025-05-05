import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Modal
} from "react-bootstrap";
import { ArrowLeftCircle } from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";
import "./ViewPage.css";

const ViewPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // Modal state

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/doctors/slug/${slug}`
        );
        setDoctor(res.data);
      } catch (err) {
        console.error("Error fetching doctor details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [slug]);

  const handleCall = () => {
    if (doctor?.mobile) {
      window.location.href = `tel:${doctor.mobile}`;
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h4>Loading...</h4>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="container mt-5 text-center">
        <h4>Doctor not found</h4>
      </div>
    );
  }

  const hospitalImage = doctor.hospitalImage
    ? `http://localhost:5000/uploads/${doctor.hospitalImage}`
    : "https://via.placeholder.com/800x400?text=No+Image";

  const doctorImage = doctor.doctorImage
    ? `http://localhost:5000/uploads/${doctor.doctorImage}`
    : null;

  return (
    <>
      <Navbar />
      <Container className="my-5">
        <Row className="justify-content-center ">
          <Col md={10}>
            <Card className="p-3 border border-primary rounded-4">
              <Card.Img
                variant="top"
                src={hospitalImage}
                alt={doctor.hospitalName || ""}
                style={{
                  maxHeight: "400px",
                  objectFit: "none",
                  borderRadius: "12px",
                }}
              />

              <Card.Body>
                <Card.Title className="text-primary text-center mb-4 fs-2">
                  {doctor.hospitalName}
                </Card.Title>

                <Row className="gy-3">
                  <Col md={6}>
                    <strong>Doctor Name:</strong>
                    <div>{doctor.doctorName}</div>
                  </Col>
                  <Col md={6}>
                    <strong>Specialization:</strong>
                    <div>{doctor.specialization}</div>
                  </Col>
                  <Col md={6}>
                    <strong>Category:</strong>
                    <div>{doctor.category}</div>
                  </Col>
                  <Col md={6}>
                    <strong>Experience:</strong>
                    <div>{doctor.experience} years</div>
                  </Col>
                  <Col md={6}>
                    <strong>Email:</strong>
                    <div>{doctor.email}</div>
                  </Col>
                  <Col md={6}>
                    <strong>Mobile:</strong>
                    <div>{doctor.mobile}</div>
                  </Col>
                  <Col md={6}>
                    <strong>Website:</strong>
                    <div>
                      {doctor.website ? (
                        <a
                          href={doctor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {doctor.website}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </div>
                  </Col>
                  <Col md={6}>
                    <strong>Address:</strong>
                    <div>{doctor.address}</div>
                  </Col>
                  <Col md={12}>
                    <strong>Description:</strong>
                    <div className="doctor_description">
                      {doctor.description}
                    </div>
                  </Col>

                  {doctorImage && (
                    <Col md={12} className="text-center">
                      <h5>Doctor Image</h5>
                      <img
                        src={doctorImage}
                        alt={doctor.doctorName || ""}
                        style={{
                          width: "200px",
                          borderRadius: "10px",
                        }}
                      />
                    </Col>
                  )}
                </Row>

                {/* Book Appointment Button */}
                {doctor.mobile && (
                  <Col md={12} className="text-center mt-4">
                    <Button
                      variant="success"
                      size="lg"
                      onClick={() => setShowModal(true)}
                    >
                      📞 Book Appointment
                    </Button>
                  </Col>
                )}

                {/* Back Button */}
                <div className="mt-4">
                  <Button
                    variant="outline-secondary"
                    className="w-100"
                    onClick={() => navigate("/hospitals")}
                  >
                    <ArrowLeftCircle className="me-2" size={20} />
                    Back to Hospitals List
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Call Confirmation Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Call</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to call{" "}
            <strong>{doctor.mobile}</strong> to book an appointment?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleCall}>
              Yes, Call Now
            </Button>
          </Modal.Footer>
        </Modal>

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </Container>
    </>
  );
};

export default ViewPage;
