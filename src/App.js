import React from "react";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import EmployerDashboard from "./pages/EmployerDashboard";
import "@fortawesome/fontawesome-free/css/all.min.css";

const App = () => {
  return (
    <div>
      <Navbar />
      <EmployerDashboard />
      <AppRoutes />
      <Footer />
    </div>
  );
};

export default App;
