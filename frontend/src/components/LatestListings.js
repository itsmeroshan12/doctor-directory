import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
            <div className="col-md-4 mb-4" key={doc.id}>
              <div className="card h-100 border border-2 rounded-4 shadow-sm">
                <img
                  src={`http://localhost:5000/uploads/${doc.hospitalImage}`}
                  className="card-img-top rounded-top"
                  alt={doc.hospitalName}
                  style={{ objectFit: 'cover', height: '200px' }}
                />
                <div className="card-body">
                  <h5 className="card-title text-primary">{doc.hospitalName}</h5>
                  <p className="card-text mb-1"><strong>Doctor:</strong> {doc.doctorName}</p>
                  <p className="card-text mb-1"><strong>Specialization:</strong> {doc.specialization}</p>
                  <p className="card-text mb-1"><strong>Experience:</strong> {doc.experience} years</p>
                  <p className="card-text"><strong>Category:</strong> {doc.category}</p>
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
