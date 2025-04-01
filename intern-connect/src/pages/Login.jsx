import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/pages/login.scss"; 
import "bootstrap/dist/css/bootstrap.min.css";
import loginImage from "../images/login.jpg";
import Button from '../components/Button';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="login-page d-flex vh-100">
      <div className="login-form-container d-flex flex-column justify-content-center align-items-center p-4">
        <div className="login-box">
          <h2 className="text-center text-primary mb-4 ">ĐĂNG NHẬP</h2>
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

            <div className="text-end mb-3">
              <a href="#" className="text-primary">Quên mật khẩu?</a>
            </div>
            <Button text="Sign in" variant="btn btn-primary w-100" type="submit"/>
          </form>

          <p className="text-center mt-3">
            Bạn chưa có tài khoản? <Link to="/register" className="text-primary">Đăng ký</Link>
          </p>
        </div>
      </div>

      <div className="login-image-container">
        <img
          src={loginImage}
          alt="Students"
          className="w-100 h-100 object-fit-cover"
        />
      </div>
    </div>
  );
};

export default Login;
