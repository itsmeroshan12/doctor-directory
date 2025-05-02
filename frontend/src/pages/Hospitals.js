import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import './Hospitals.css';  // Import external CSS file

const Hospitals = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const slugify = (text) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/doctors?page=${currentPage}`);
        setDoctors(response.data.doctors);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [currentPage]);

  const filteredDoctors = doctors.filter((doctor) => {
    const searchMatch =
      doctor?.hospitalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor?.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const categoryMatch =
      categoryFilter === "" || doctor?.category === categoryFilter;

    return searchMatch && categoryMatch;
  });

  const handleBack = () => {
    navigate("/");
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="d-flex justify-content-start mb-3">
          <button className="btn btn-secondary" onClick={handleBack}>
            ⬅️ Back to Home
          </button>
        </div>
        <h1 className="mb-4 text-center">Listed Hospitals & Doctors</h1>

        {/* Search and Category Filter */}
        <div className="row mb-4">
          <div className="col-md-6 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Search by hospital name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <select
              className="form-control"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Select Category</option>
              <option value="">None</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Gynecology">Gynecology</option>
              <option value="Neurology">Neurology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Dentistry">Dentistry</option>
              <option value="General Surgery">General Surgery</option>
              <option value="ENT">ENT</option>
              <option value="Psychiatry">Psychiatry</option>
            </select>
          </div>
        </div>

        <div className="row">
          {loading ? (
            <div className="col-12 text-center">
              <p>Loading doctors...</p>
            </div>
          ) : filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => {
              const slug = doctor?.hospitalName ? slugify(doctor.hospitalName) : `doctor-${doctor.id}`;

              return (
                <div key={doctor.id} className="col-md-4 mb-4">
                  <div className="card h-100 custom-card-border">
                    <img
                      src={`http://localhost:5000/uploads/${doctor?.hospitalImage || "default-image.jpg"}`}
                      className="card-img-top"
                      alt={doctor?.hospitalName || "Hospital"}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title text-primary">{doctor?.hospitalName || "N/A"}</h5>
                      <p className="card-text mb-1"><strong>Doctor:</strong> {doctor?.doctorName || "N/A"}</p>
                      <p className="card-text mb-1"><strong>Specialization:</strong> {doctor?.specialization || "N/A"}</p>
                      <p className="card-text mb-1"><strong>Experience:</strong> {doctor?.experience ? `${doctor.experience} years` : "N/A"}</p>
                      <p className="card-text mb-3"><strong>Category:</strong> {doctor?.category || "N/A"}</p>
                      <button
                        className="btn btn-outline-primary mt-auto"
                        onClick={() => navigate(`/hospitals/${slug}`)}
                      >
                        View Page
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-12 text-center">
              <p>No doctors found.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-center mt-4">
          <nav>
            <ul className="pagination">
              {[...Array(totalPages).keys()].map((num) => (
                <li key={num} className={`page-item ${currentPage === num + 1 ? "active" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage(num + 1)}>
                    {num + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Hospitals;
