import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Hospitals from "./pages/Hospitals";
import ViewPage from "./pages/ViewPage"; // Your view form page
import EditDoctor from "./pages/EditDoctor"; // Import the edit page
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './pages/Login'; // <-- To be created
import Register from './pages/Register'; // <-- To be created
import ResetPassword  from "./pages/ResetPassword"; // reset the password 
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import MyListings from "./components/MyListings";
import Footer from "./components/Footer"; // Import the Footer component
import './App.css'; // Import your CSS file

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hospitals" element={<Hospitals />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/register" element={<Register />} /> {/* Corrected this line */}
        <Route path="/hospitals/:slug" element={<ViewPage />} />
        <Route path="/hospitals/edit/:slug" element={<EditDoctor />} />
        <Route path="/user/reset-password/:token" element={<ResetPassword />} /> {/* Reset password route */}
        <Route path="/user/items" element={<MyListings />} />
        <Route path="/user/items/:slug" element={<ViewPage />} /> {/* View form page */}  
        <Route path="/footer" element={<Footer />} /> {/* Footer route */}
        <Route path="./App.css" element={<App />} /> {/* CSS file route */}


      </Routes>
    </Router>
  );
};

export default App;
