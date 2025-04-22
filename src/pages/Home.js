import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    hospitalName: "",
    doctorName: "",
    mobile: "",
    email: "",
    website: "",
    experience: "",
    specialization: "",
    category: "",
    hospitalImage: null,
    doctorImage: null,
    description: "",
    address: "",
  });

  const categories = [
    "Cardiology", "Orthopedics", "Dermatology", "Gynecology", "Neurology",
    "Pediatrics", "Dentistry", "General Surgery", "ENT", "Psychiatry"
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const resetForm = () => {
    setFormData({
      hospitalName: "",
      doctorName: "",
      mobile: "",
      email: "",
      website: "",
      experience: "",
      specialization: "",
      category: "",
      hospitalImage: null,
      doctorImage: null,
      description: "",
      address: "",
    });
    document.getElementById("hospitalImage").value = "";
    document.getElementById("doctorImage").value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      await axios.post("http://localhost:5000/api/doctors", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      toast.success("Doctor added successfully!");
      resetForm();
    } catch (error) {
      console.error("Error adding doctor:", error);
      toast.error("Failed to add doctor");
    }
  };

  return (
    <div className="container my-5">
      <ToastContainer />
      <div className="card shadow-lg p-5">
        <h2 className="mb-4 text-center text-primary">Add Doctor & Hospital Details</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-3">
            <label className="form-label">Hospital Name</label>
            <input
              type="text"
              className="form-control"
              name="hospitalName"
              value={formData.hospitalName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Doctor Name</label>
            <input
              type="text"
              className="form-control"
              name="doctorName"
              value={formData.doctorName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="row">
            <div className="mb-3 col-md-6">
              <label className="form-label">Mobile Number</label>
              <input
                type="tel"
                className="form-control"
                name="mobile"
                value={formData.mobile}
                minLength="10"
                maxLength="10"
                inputMode="numeric"
                pattern="[0-9]*"
                onChange={(e) => {
                  const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                  handleChange({ target: { name: 'mobile', value: onlyNums } });
                }}
                required
              />
            </div>

            <div className="mb-3 col-md-6">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-control"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>


          <div className="mb-3">
            <label className="form-label">Website URL</label>
            <input
              type="url"
              className="form-control"
              name="website"
              value={formData.website}
              onChange={handleChange}
            />
          </div>

          <div className="row">
            <div className="mb-3 col-md-6">
              <label className="form-label">Experience (in years)</label>
              <input
                type="number"
                className="form-control"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3 col-md-6">
              <label className="form-label">Specialization</label>
              <input
                type="text"
                className="form-control"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">--Select Category--</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Hospital Image</label>
            <input
              type="file"
              className="form-control"
              id="hospitalImage"
              name="hospitalImage"
              accept="image/*"
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Doctor Image</label>
            <input
              type="file"
              className="form-control"
              id="doctorImage"
              name="doctorImage"
              accept="image/*"
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="d-flex justify-content-between mt-4">
            <button type="submit" className="btn btn-primary">Submit</button>
            <button type="button" className="btn btn-secondary" onClick={resetForm}>Clear</button>
            <button type="button" className="btn btn-success" onClick={() => navigate("/hospitals")}>
              Check Listed Hospitals
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
