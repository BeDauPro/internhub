import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/pages/login.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import loginImage from "../images/login.jpg";
import Button from '../components/Button';
import { loginUser as loginApi } from '../services/authApi';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      const data = { email, password };
      const response = await loginApi(data);
      if (response.status === 200) {
        const { token, role } = response.data;
        localStorage.setItem("token", token.token);
        localStorage.setItem("role", role);

        alert("Đăng nhập thành công!");

        if (role.toLowerCase() === "student") {
          navigate("/findjob");
        } else if (role.toLowerCase() === "admin") {
          navigate("/studentmanagement");
        } else if (role.toLowerCase() === "employer") {
          navigate("/employerprofile");
        } else {
          navigate("/unauthorized");
        }
      } else {
        alert("Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("Email hoặc mật khẩu không đúng.");
      } else {
        alert("Đã xảy ra lỗi không xác định.");
      }
    }
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
              {errors.Email && (
                <div className="text-danger">{errors.Email[0]}</div>
              )}
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
              {errors.Password && <div className="text-danger mt-1">{errors.Password}</div>}
            </div>

            <div className="text-end mb-3">
              <a href="#" className="text-primary" onClick={() => navigate("/forgotpassword")}>Quên mật khẩu?</a>
            </div>
            <Button text="Sign in" variant="btn btn-primary w-100" type="submit" />
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
