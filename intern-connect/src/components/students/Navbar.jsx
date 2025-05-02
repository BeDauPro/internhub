import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/components/navbar.scss";
import { useNavigate } from "react-router-dom";
import Notification from "../../pages/student/Notification";
import { getStudentProfile } from "../../services/studentApi";
import { useAuthContext } from "../../context/authContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);
  const [student, setStudent] = useState(null);
  const {logout} = useAuthContext()
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const studentId = localStorage.getItem("studentId"); // Lấy studentId từ localStorage
        const data = await getStudentProfile(studentId);
        setStudent(data);
      } catch (err) {
        console.error("Error fetching student data:", err);
      }
    };

    fetchStudentData();
  }, []);

  const handleLogoutClick = () => {
    logout()
    navigate("/login");
  };

  const toggleNotification = () => {
    setShowNotification((prev) => !prev);
  };

  return (
    <div className="navbar-container">
      <nav className="navbar navbar-expand-lg navbar-dark shadow">
        <div className="container-fluid">
          <a className="navbar-brand d-flex align-items-center" href="#">
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              alt="Logo"
              height="30"
              className="me-2"
            />
            <span className="fw-semibold">InternHub</span>
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#"
                  onClick={() => navigate("/findjob")}
                >
                  Tìm kiếm việc làm
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#"
                  onClick={() => navigate("/eventstudent")}
                >
                  Sự kiện
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#"
                  onClick={() => navigate("/applicationhistory")}
                >
                  Lịch sử ứng tuyển
                </a>
              </li>
            </ul>

            <div className="d-flex align-items-center position-relative">
              <button
                className="btn btn-notification me-3"
                onClick={toggleNotification}
              >
                <i className="fas fa-bell text-dark"></i>
                <span className="badge bg-danger">3</span>
              </button>
              {showNotification && <Notification />}

              <div className="dropdown">
                <button
                  className="btn user-btn dropdown-toggle"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                >
                  <img
                    src={
                      student?.profilePicture
                        ? `${student.profilePicture}?t=${new Date().getTime()}`
                        : "/default-avatar.png"
                    }
                    alt="User"
                  />
                  <span className="studentName">
                    {student?.fullName || "Student Role"}
                  </span>
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="userDropdown"
                >
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => navigate("/studentprofile")}
                    >
                      Hồ sơ cá nhân
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={handleLogoutClick}
                    >
                      Đăng xuất
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;