import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/pages/admin/createaccount.scss";
import NavbarAdmin from "../../components/admin/NavbarAdmin";
import Footer from "../../components/Footer";

const CreateAccount = ({ onAddAccount }) => {
  const navigate = useNavigate();
  const [newAccount, setNewAccount] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAccount({ ...newAccount, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onAddAccount) {
      onAddAccount({ ...newAccount, createdAt: new Date().toISOString().split("T")[0] });
    }
    navigate("/accountmanagement");
  };

  useEffect(() => {
    // Reset the form after submission
    setNewAccount({
      username: "",
      email: "",
      password: "",
    });
  }, [onAddAccount]);

  return (
    <>
      <NavbarAdmin />
      <div className="create-account-container">
        <h1 className="page-title">Tạo tài khoản mới</h1>
        <form className="create-account-form" onSubmit={handleSubmit}>
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={newAccount.username}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={newAccount.email}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Mật khẩu:
            <input
              type="password"
              name="password"
              value={newAccount.password}
              onChange={handleInputChange}
              required
            />
          </label>
          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/accountmanagement")}
            >
              Hủy
            </button>
            <button type="submit" className="submit-button">
              Tạo tài khoản
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default CreateAccount;
