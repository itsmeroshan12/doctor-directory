import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Hospitals from "./pages/Hospitals";
import ViewPage from "./pages/ViewPage"; // Your view form page
import EditDoctor from "./pages/EditDoctor"; // Import the edit page
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hospitals" element={<Hospitals />} />
        <Route path="/hospitals/:slug" element={<ViewPage />} />
        <Route path="/hospitals/edit/:slug" element={<EditDoctor />} />
      </Routes>
    </Router>
  );
};

export default App;
// import React from "react";