import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/components/navbar.scss";

const Navbar = () => {
  return (
    <div className="bg-img">
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
                <li className="nav-item"><a className="nav-link" href="#">Tìm kiếm việc làm</a></li>
                <li className="nav-item"><a className="nav-link" href="#">Sự kiện</a></li>
                <li className="nav-item"><a className="nav-link" href="#">Lịch sử ứng tuyển</a></li>
              </ul>
              

   
              <div className="d-flex align-items-center">
          
                <button className="btn btn-notification me-3">
                  <i className="fas fa-bell text-dark"></i>
                  <span className="badge bg-danger">3</span>
                </button>

         
                <div className="dropdown">
                  <button className="btn user-btn dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown">
                    <img src="https://scontent.fdad3-6.fna.fbcdn.net/v/t39.30808-6/430887639_3710404215952936_6070542769021088651_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=bJ8ZUPCpIzMQ7kNvgGhWuY3&_nc_oc=AdhF3X1fn96HgOYdIIhEFAUMi6wGC4CQA3FcvXUJmBgH0UhJoZ9w0f-MWEvgjcYvbfQ&_nc_zt=23&_nc_ht=scontent.fdad3-6.fna&_nc_gid=AmtZde7YYz31so6mUQiW7Y4&oh=00_AYE1m3BBUyYRRp7_hbbcIJPy7eGVKXd0SC6DV6GN8qY7vQ&oe=67D83517" alt="User" />
                    <span className="studentName">Nguyen Duc</span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                    <li><a className="dropdown-item" href="#">Hồ sơ cá nhân</a></li>
                    <li><a className="dropdown-item" href="/loign">Đăng xuất</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;