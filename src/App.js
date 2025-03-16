import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import NavbarEmployer from "./components/employer/NavbarEmployer";
import Navbar from "./components/students/Navbar";
import Footer from "./components/Footer";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FindJob from "./pages/student/FindJob";


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      {/* {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <> */}
          <FindJob />
        {/* </>
      )} */}

    </Router>
  );
};

export default App;


