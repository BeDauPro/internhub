import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/components/footer.scss";
const Footer = () => {
  return (
    <footer className="bg-light text-center text-lg-start">
      <div className="text-center p-4" style={{ backgroundColor: "rgba(18, 48, 130)" }}>
        <ul className="footer-links">
          <li>
            <a className="text-light">
              <i className="fas fa-map-marker-alt me-2"></i>
              77 Nguyễn Huệ, Tp.Huế</a>
          </li>
          <li>
            <a className="text-light">
              <i className="fas fa-envelope me-2"></i>
              khoacntt@husc.edu.vn</a>
          </li>
          <li>
            <a className="text-light">
              <i className="fas fa-phone me-2"></i>
              0234 3826 767</a>
          </li>
          <li>
            <a className="text-light">
            <i className="fas fa-globe me-2"></i>
              it.husc.edu.vn</a>
          </li>
        </ul>
      </div>
    </footer>
  )
};

export default Footer;
