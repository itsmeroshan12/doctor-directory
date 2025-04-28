import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Hospitals = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [searchTerm, setSearchTerm] = useState(""); // Search input state
  const [categoryFilter, setCategoryFilter] = useState(""); // Category filter state
  const navigate = useNavigate();

  // Convert hospitalName to a slug (URL-friendly)
  const slugify = (text) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  // Fetch doctors from backend
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true); // Show loading before fetch
        const response = await axios.get("http://localhost:5000/api/doctors");
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false); // Stop loading after fetch
      }
    };

    fetchDoctors();
  }, []);

  // Filter doctors based on search term and category filter
  const filteredDoctors = doctors.filter((doctor) => {
    const searchMatch =
      doctor.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.category.toLowerCase().includes(searchTerm.toLowerCase());

    const categoryMatch =
      categoryFilter === "" || doctor.category === categoryFilter;

    return searchMatch && categoryMatch;
  });

  // back to menu page
  const handleBack = () => {
    navigate('/');
  }

  return (
   

    <div className="container mt-5">

      <div className="d-flex justify-content-start mb-3">
        <button className="btn btn-secondary" onClick={handleBack}>
        ⬅️ Back to Menu
        </button>
      </div>
      <h1 className="mb-4 text-center">Listed Hospitals & Doctors</h1>
      
      {/* Search and Category Filter */}
      <div className="row mb-4">
        <div className="col-md-6">
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
            const slug = slugify(doctor.hospitalName);

            return (
              <div key={doctor.id} className="col-md-4 mb-4">
                <div className="card h-100 shadow-sm">
                  <img
                    src={`http://localhost:5000/uploads/${doctor.hospitalImage || "default-image.jpg"}`}
                    className="card-img-top"
                    alt={doctor.hospitalName}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{doctor.hospitalName}</h5>
                    <p className="card-text mb-1"><strong>Doctor:</strong> {doctor.doctorName}</p>
                    <p className="card-text mb-1"><strong>Specialization:</strong> {doctor.specialization}</p>
                    <p className="card-text mb-1"><strong>Experience:</strong> {doctor.experience} years</p>
                    <p className="card-text mb-3"><strong>Category:</strong> {doctor.category}</p>
                    <button
                      className="btn btn-primary mt-auto"
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
    </div>
  );
};

export default Hospitals;
