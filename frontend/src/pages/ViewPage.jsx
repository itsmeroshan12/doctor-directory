import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import { ArrowLeftCircle } from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";
import "./ViewPage.css"; // Import external CSS file

const ViewPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <Container className="mt-5">
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
                    <div className="doctor_description">{doctor.description}</div>
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
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </Container>
    </>
  );
};

export default ViewPage;





// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Button, Card, Container, Row, Col, Modal } from "react-bootstrap";
// import { ArrowLeftCircle } from 'react-bootstrap-icons';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const ViewPage = () => {
//   const { slug } = useParams();
//   const navigate = useNavigate();
//   const [doctor, setDoctor] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showConfirm, setShowConfirm] = useState(false); // For modal

//   useEffect(() => {
//     const fetchDoctor = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5000/api/doctors/slug/${slug}`);
//         console.log("Fetched doctor data:", res.data); // Log the fetched data
//         setDoctor(res.data);
//       } catch (err) {
//         console.error("Error fetching doctor details:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDoctor();
//   }, [slug]);

//   const handleDelete = async () => {
//     try {
//       await axios.delete(`http://localhost:5000/api/doctors/${doctor.id}`);
//       toast.success("Doctor deleted successfully!");
//       setShowConfirm(false);
//       setTimeout(() => {
//         navigate("/hospitals");
//       }, 1500);
//     } catch (err) {
//       console.error("Error deleting doctor:", err);
//       toast.error("Failed to delete doctor. Please try again.");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="container mt-5 text-center">
//         <h4>Loading...</h4>
//       </div>
//     );
//   }

//   if (!doctor) {
//     return (
//       <div className="container mt-5 text-center">
//         <h4>Doctor not found</h4>
//       </div>
//     );
//   }

//   const hospitalImage = doctor?.hospitalImage ? `http://localhost:5000/uploads/${doctor.hospitalImage}` : "https://via.placeholder.com/800x400?text=No+Image";
//   const doctorImage = doctor?.doctorImage ? `http://localhost:5000/uploads/${doctor.doctorImage}` : null;

//   return (
//     <Container className="mt-5">
//       <Row>
//         <Col md={12} className="text-center mb-4">
//           <Card.Img
//             variant="top"
//             src={hospitalImage}
//             alt={doctor?.hospitalName || "Hospital"}
//             style={{
//               maxHeight: "400px",
//               objectFit: "cover",
//               borderRadius: "8px",
//               boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
//             }}
//           />
//         </Col>
//       </Row>

//       <Row>
//         <Col md={12} className="text-center mb-4">
//           <Card className="shadow-lg rounded">
//             <Card.Body>
//               <Card.Title as="h2" className="text-primary mb-3">
//                 {doctor?.hospitalName || "Unknown Hospital"}
//               </Card.Title>
//               <Card.Text><strong>Doctor Name:</strong> {doctor?.doctorName || "N/A"}</Card.Text>
//               <Card.Text><strong>Specialization:</strong> {doctor?.specialization || "N/A"}</Card.Text>
//               <Card.Text><strong>Category:</strong> {doctor?.category || "N/A"}</Card.Text>
//               <Card.Text><strong>Experience:</strong> {doctor?.experience ? `${doctor.experience} years` : "N/A"}</Card.Text>
//               <Card.Text><strong>Email:</strong> {doctor?.email || "N/A"}</Card.Text>
//               <Card.Text><strong>Mobile:</strong> {doctor?.mobile || "N/A"}</Card.Text>
//               <Card.Text>
//                 <strong>Website:</strong>{" "}
//                 {doctor?.website ? (
//                   <a href={doctor.website} target="_blank" rel="noreferrer">{doctor.website}</a>
//                 ) : (
//                   "N/A"
//                 )}
//               </Card.Text>
//               <Card.Text><strong>Address:</strong> {doctor?.address || "N/A"}</Card.Text>
//               <Card.Text><strong>Description:</strong> {doctor?.description || "N/A"}</Card.Text>

//               {doctorImage && (
//                 <div className="mb-4 text-center">
//                   <h5>Doctor Image</h5>
//                   <img
//                     src={doctorImage}
//                     alt={doctor?.doctorName || "Doctor"}
//                     style={{
//                       width: "200px",
//                       height: "auto",
//                       borderRadius: "10px",
//                       boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
//                     }}
//                   />
//                 </div>
//               )}

//               <Button
//                 variant="primary"
//                 className="mb-3 w-100"
//                 onClick={() => navigate(`/hospitals/edit/${slug}`)}
//               >
//                 ✏️ Edit Details
//               </Button>

//               <Button
//                 variant="outline-secondary"
//                 className="w-100"
//                 onClick={() => navigate("/hospitals")}
//               >
//                 <ArrowLeftCircle className="me-2" size={20} />
//                 Back to Hospitals List
//               </Button>

//               <Button
//                 variant="danger"
//                 className="w-100 mt-3"
//                 onClick={() => setShowConfirm(true)}
//               >
//                 🗑️ Delete Doctor
//               </Button>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Delete Confirmation Modal */}
//       <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm Deletion</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           Are you sure you want to delete <strong>{doctor?.doctorName}</strong>?
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowConfirm(false)}>
//             Cancel
//           </Button>
//           <Button variant="danger" onClick={handleDelete}>
//             Delete
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
//     </Container>
//   );
// };

// export default ViewPage;
