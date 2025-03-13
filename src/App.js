import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import EmployerDashboard from "./pages/EmployerDashboard";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Login from "./pages/Login";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <Navbar />
          <EmployerDashboard />
          <AppRoutes />
          <Footer />
        </>
      )}
    </Router>
  );
};

export default App;


