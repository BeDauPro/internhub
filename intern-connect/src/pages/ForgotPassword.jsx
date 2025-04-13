import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/login.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from '../components/Button';
import { resetPassword as resetPasswordApi, sendForgotPassword as sendForgotPasswordApi } from '../services/authApi';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [isTokenSent, setIsTokenSent] = useState(false);
    const navigate = useNavigate();

    const handleSendToken = async () => {
        setErrors({});
        try {
            const response = await sendForgotPasswordApi(email);
            if (response.status === 200 || response.status === 204) {
                alert("Token đã được gửi đến email của bạn!");
                setIsTokenSent(true);
            } else {
                alert("Gửi token thất bại. Vui lòng thử lại.");
            }
        } catch (error) {
            if (error.response && error.response.status === 403) {
                alert("Bạn không có quyền thực hiện hành động này.");
                navigate("/unauthorized"); // Redirect to unauthorized page
            } else if (error.response && error.response.status === 400) {
                alert("Email không hợp lệ.");
            } else {
                alert("Đã xảy ra lỗi không xác định.");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        if (newPassword !== confirmPassword) {
            setErrors({ confirmPassword: "Mật khẩu xác nhận không khớp." });
            return;
        }
        try {
            const data = {
                Email: email,
                Token: token,
                NewPassword: newPassword,
                ConfirmPassword: confirmPassword
            };
            console.log("Request Payload:", data); 
            const response = await resetPasswordApi(data);
            if (response.status === 200 || response.status === 204) {
                alert("Đặt lại mật khẩu thành công!");
                navigate("/login");
            } else {
                alert("Đặt lại mật khẩu thất bại. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Error Response:", error.response);
            if (error.response && error.response.status === 400) {
                alert("Thông tin không hợp lệ.");
            } else {
                alert("Đã xảy ra lỗi không xác định.");
            }
        }
    };

    return (
        <div className="login-page d-flex vh-100">
            <div className="login-form-container d-flex flex-column justify-content-center align-items-center p-4">
                <div className="login-box">
                    <h2 className="text-center text-primary mb-4">QUÊN MẬT KHẨU</h2>
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

                        {!isTokenSent && (
                            <Button
                                text="Gửi Token"
                                variant="btn btn-secondary w-100 mb-3"
                                type="button"
                                onClick={handleSendToken}
                            />
                        )}

                        {isTokenSent && (
                            <>
                                <div className="mb-3">
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <i className="fas fa-key"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Nhập token"
                                            value={token}
                                            onChange={(e) => setToken(e.target.value)}
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
                                            placeholder="Nhập mật khẩu mới"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
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
                                            placeholder="Xác nhận mật khẩu mới"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    {errors.confirmPassword && (
                                        <div className="text-danger mt-1">{errors.confirmPassword}</div>
                                    )}
                                </div>

                                <Button text="Reset Password" variant="btn btn-primary w-100" type="submit" />
                            </>
                        )}
                    </form>
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

export default ForgotPassword;
