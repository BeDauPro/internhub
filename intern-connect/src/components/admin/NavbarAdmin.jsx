import React from 'react'
import { useNavigate } from "react-router-dom";

const NavbarAdmin = () => {
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
                <li className="nav-item"><a className="nav-link" href="#" onClick={() => navigate("/confirmjobs")}>Quản lý bài đăng</a></li>
                <li className="nav-item"><a className="nav-link" href="#" onClick={() => navigate("/studentmanagement")}>Sinh viên thực tập</a></li>
                <li className="nav-item"><a className="nav-link" href="#" onClick={() => navigate("/eventmanagement")}>Quản lý sự kiện</a></li>
              </ul>
  
              <div className="d-flex align-items-center">
                <div className="dropdown">
                  <button className="btn user-btn dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown">
                    <span className="studentName">Admin</span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                    <li><a className="dropdown-item" href="/loign">Đăng xuất</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    )
}

export default NavbarAdmin
