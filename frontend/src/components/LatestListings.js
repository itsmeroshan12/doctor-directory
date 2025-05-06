import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LatestListings.css'; // Import  CSS file for styling

const LatestListings = () => {
  const [latestDoctors, setLatestDoctors] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestDoctors = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/doctors/latest');
        if (Array.isArray(res.data)) {
          setLatestDoctors(res.data);
        } else {
          console.error('Response is not an array:', res.data);
        }
      } catch (error) {
        console.error('Error fetching latest listings:', error);
      }
    };

    fetchLatestDoctors();
  }, []);

  const fetchAllDoctors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/doctors');
      if (Array.isArray(res.data.doctors)) {
        setAllDoctors(res.data.doctors);
        setShowAll(true);
        navigate("/hospitals");
      } else {
        console.error('Response is not an array:', res.data);
      }
    } catch (error) {
      console.error('Error fetching all listings:', error);
    }
  };

  const doctorsToDisplay = showAll ? allDoctors : latestDoctors;

  return (  
    <div className="container mt-5">
      <h2 className="mb-4 text-center text-primary">Latest Listings</h2>

      <div className="row">
        {doctorsToDisplay.length > 0 ? (
          doctorsToDisplay.map((doc) => (
            <div className="col-12 col-sm-4 col-md-4 mb-4" key={doc.id}>
              <div className="card h-100 shadow border-0 rounded-4 overflow-hidden latest-listing-card">
                <div style={{ position: 'relative' }}>
                  <img
                    src={`http://localhost:5000/uploads/${doc.hospitalImage}`}
                    className="card-img-top"
                    alt={doc.hospitalName}
                    style={{ objectFit: 'cover', height: '220px' }}
                  />
                </div>
                <div className="card-body bg-light rounded-bottom px-4 py-3">
                  <h5 className="card-title text-primary mb-2">{doc.hospitalName}</h5>
                  <p className="mb-1"><strong>👨‍⚕️ Doctor:</strong> {doc.doctorName}</p>
                  <p className="mb-1"><strong>🩺 Specialization:</strong> {doc.specialization}</p>
                  <p className="mb-1"><strong>📅 Experience:</strong> {doc.experience} years</p>
                  <p className="mb-0"><strong>🏷 Category:</strong> {doc.category}</p>
                </div>
                <div className="card-footer bg-light text-muted text-end py-2">
                  <small>{new Date(doc.created_at).toLocaleDateString("en-US", {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}</small>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No listings available.</p>
        )}
      </div>

      {!showAll && (
        <div className="text-center mt-4">
          <button className="btn btn-primary px-4 py-2" onClick={fetchAllDoctors}>
            Show All Listings
          </button>
        </div>
      )}
    </div>




  );
};

export default LatestListings;
