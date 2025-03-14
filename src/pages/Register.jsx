import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/pages/register.scss"; 
import "bootstrap/dist/css/bootstrap.min.css";
import registerImage from "../images/login.jpg";
import Button from '../components/Button';

const Register = ({ onRegister }) => {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    onRegister();
  };

  return (
    <div className="register-page d-flex vh-100">
      <div className="register-image-container">
        <img
          src={registerImage}
          alt="Students"
          className="w-100 h-100 object-fit-cover"
        />
      </div>
      
      <div className="register-form-container d-flex flex-column justify-content-center align-items-center p-4">
        <div className="register-box">
          <h2 className="text-center text-primary mb-4">ĐĂNG KÝ</h2>
          <h4 className="text-center mb-2">Bạn là?</h4>
          <div className="role-selection text-center mb-3">
            <button className={`btn ${role === "student" ? "btn-primary" : "btn-outline-primary"} me-2`} onClick={() => setRole("student")}>Sinh viên</button>
            <button className={`btn ${role === "company" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setRole("company")}>Doanh nghiệp</button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-envelope"></i>
                </span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Nhập email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-lock"></i>
                </span>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-lock"></i>
                </span>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button text="Sign up" variant="btn btn-primary w-100" type="submit" />
          </form>

          <p className="text-center mt-3">
            Bạn đã có tài khoản? <Link to="/login" className="text-primary">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;