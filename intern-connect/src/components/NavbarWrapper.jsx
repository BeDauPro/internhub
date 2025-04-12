import React from "react";
import Navbar from "./students/Navbar";
import NavbarEmployer from "./employer/NavbarEmployer";
import NavbarAdmin from "./admin/NavbarAdmin";
import useAuth from "../hooks/useAuth";

const NavbarWrapper = () => {
  const { role } = useAuth();

  if (role === "Student") {
    return <Navbar />;
  } else if (role === "Employer") {
    return <NavbarEmployer />;
  } else if (role === "Admin") {
    return <NavbarAdmin />;
  } else {
    return null;
  }
};

export default NavbarWrapper;
