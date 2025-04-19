import React from 'react'
import loginLogo from '../../images/login.jpg';
import { useNavigate } from "react-router-dom";

const NavbarEmployer = () => {
  const navigate = useNavigate();
  return (
    <div className="navbar-container">
      <nav className="navbar navbar-expand-lg navbar-dark shadow">
        <div className="container-fluid">
          <a className="navbar-brand d-flex align-items-center" href="#">
            <img src="https://flowbite.com/docs/images/logo.svg" alt="Logo" height="30" className="me-2" />
            <span className="fw-semibold">InternHub</span>
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item"><a className="nav-link" href="#" onClick={() => navigate("/manageposts")}>Quản lý bài đăng</a></li>
              <li className="nav-item"><a className="nav-link" href="#" onClick={() => navigate("/applicationemployer")}>Các ứng viên</a></li>
            </ul>

            <div className="d-flex align-items-center">
              <div className="dropdown">
                <button className="btn user-btn dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown">
                  <img src={loginLogo} alt="User" />
                  <span className="studentName">FPT Software</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li><a className="dropdown-item" href="" onClick={() => navigate("/employerprofile")}>Hồ sơ doanh nghiệp</a></li>
                  <li><a className="dropdown-item" href="#" onClick={() => navigate("/login")}>Đăng xuất</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default NavbarEmployer
