import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/login.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "../components/Button";
import { verifyEmail } from "../services/authApi";

const EmailVerification = () => {
  const [token, setToken] = useState(""); // Token xác thực
  const [error, setError] = useState(""); // Lưu trữ lỗi nếu có
  const navigate = useNavigate();

  const handleVerifyEmail = async () => {
    setError(""); // Reset lỗi trước khi gửi yêu cầu
    try {
      const response = await verifyEmail(token); // Gửi token để xác thực
      if (response) {
        alert("Email của bạn đã được xác thực thành công!");
        navigate("/login"); // Chuyển hướng đến trang đăng nhập
      }
    } catch (err) {
      console.error("Error verifying email:", err);
      setError("Xác thực email thất bại. Vui lòng kiểm tra token và thử lại.");
    }
  };

  return (
    <div className="login-page d-flex vh-100">
      <div className="login-form-container d-flex flex-column justify-content-center align-items-center p-4">
        <div className="login-box">
          <h2 className="text-center text-primary mb-4">XÁC THỰC EMAIL</h2>
          <div className="mb-3">
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-key"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập token xác thực"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
              />
            </div>
          </div>
          {error && <div className="text-danger mb-3">{error}</div>}
          <Button
            text="Xác Thực Email"
            variant="btn btn-primary w-100"
            type="button"
            onClick={handleVerifyEmail}
          />
          <Button
            text="Quay về trang Đăng nhập"
            variant="btn btn-link w-100 mt-3"
            type="button"
            onClick={() => navigate("/login")}
          />
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;