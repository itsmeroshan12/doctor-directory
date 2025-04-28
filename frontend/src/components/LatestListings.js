import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // To handle navigation

const LatestListings = () => {
  const [latestDoctors, setLatestDoctors] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [showAll, setShowAll] = useState(false); // State to toggle between latest and all doctors
  const navigate = useNavigate(); // To navigate to the hospital list

  useEffect(() => {
    const fetchLatestDoctors = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/doctors/latest');
        setLatestDoctors(res.data);
      } catch (error) {
        console.error('Error fetching latest listings:', error);
      }
    };

    fetchLatestDoctors();
  }, []);

  const fetchAllDoctors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/doctors');
      setAllDoctors(res.data);
      setShowAll(true); // Toggle to show all doctors
      navigate("/hospitals"); // Redirect to the hospitals page after showing all listings
    } catch (error) {
      console.error('Error fetching all listings:', error);
    }
  };

  const doctorsToDisplay = showAll ? allDoctors : latestDoctors;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Latest Listings</h2>

      <div className="row">
        {doctorsToDisplay.map((doc) => (
          <div className="col-md-4 mb-4" key={doc.id}>
            <div className="card h-100 shadow-sm border-0 rounded">
              <img
                src={`http://localhost:5000/uploads/${doc.hospitalImage}`} // Hospital image
                className="card-img-top"
                alt={doc.hospitalName}
                style={{ objectFit: 'cover', height: '200px' }}
              />
              <div className="card-body">
                <h5 className="card-title text-primary">{doc.hospitalName}</h5> {/* Hospital Name */}
                <p className="card-text"><strong>Doctor:</strong> {doc.doctorName}</p>
                <p className="card-text"><strong>Specialization:</strong> {doc.specialization}</p>
                <p className="card-text"><strong>Experience:</strong> {doc.experience} years</p>
                <p className="card-text"><strong>Category:</strong> {doc.category}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Button to load all doctors and navigate to hospital list */}
      <div className="text-center mt-4">
        {!showAll && (
          <button className="btn btn-primary" onClick={fetchAllDoctors}>
            Show All Listings
          </button>
        )}
      </div>
    </div>
  );
};

export default LatestListings;
