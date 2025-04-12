import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/pages/register.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import registerImage from "../images/login.jpg";
import Button from '../components/Button';
import { registerUser as registerApi } from '../services/authApi';


const Register = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Mật khẩu xác nhận không khớp" });
      return;
    }
    try {
      const data = {
        userName: userName || email.split("@")[0], // tự sinh từ email nếu chưa nhập
        email,
        password,
        confirmPassword,
      };
      await registerApi(data);
      alert("Đăng ký thành công! Vui lòng kiểm tra email để xác thực.");
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const apiErrors = error.response.data.errors;
        const formattedErrors = {};

        for (const key in apiErrors) {
          formattedErrors[key] = apiErrors[key][0]; // chỉ lấy dòng đầu
        }

        setErrors(formattedErrors);
      } else {
        alert("Đã xảy ra lỗi không xác định.");
      }
    }
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
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-user"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tên đăng nhập"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              {errors.userName && <div className="text-danger">{errors.userName}</div>}
            </div>
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
              {errors.confirmPassword && <div className="text-danger mt-1">{errors.confirmPassword}</div>}
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