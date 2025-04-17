import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/pages/admin/createaccount.scss";
import Footer from "../../components/Footer";
import { createEmployerAccount } from "../../services/adminApi"; // Adjust import path as needed

const CreateAccount = () => {
  const navigate = useNavigate();
  const [newAccount, setNewAccount] = useState({
    userName: "",
    email: "",
    password: "",
    phone: "", // Added phone field
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAccount({ ...newAccount, [name]: value });
    // Clear previous errors when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Ensure username ends with 'company'
      const accountData = {
        ...newAccount,
        userName: newAccount.userName.endsWith('company') 
          ? newAccount.userName 
          : `${newAccount.userName}company`
      };

      // Call API to create account
      const createdAccount = await createEmployerAccount(accountData);
      
      // Success notification or handling
      alert("Tạo tài khoản thành công!");
      
      // Navigate back to account management
      navigate("/accountmanagement");
    } catch (err) {
      // Handle API errors
      console.error("Error creating account:", err);
      setError(err.data?.error || "Không thể tạo tài khoản. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="create-account-container">
        <h1 className="page-title">Tạo tài khoản mới</h1>
        <form className="create-account-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <label>
            Username:
            <input
              type="text"
              name="userName"
              value={newAccount.userName}
              onChange={handleInputChange}
              required
              placeholder="Nhập username (sẽ tự động thêm 'company')"
            />
            <small>Lưu ý: Username sẽ tự động thêm 'company' nếu chưa có</small>
          </label>
          
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={newAccount.email}
              onChange={handleInputChange}
              required
              placeholder="Nhập email"
            />
          </label>
          
          <label>
            Số điện thoại:
            <input
              type="tel"
              name="phone"
              value={newAccount.phone}
              onChange={handleInputChange}
              required
              placeholder="Nhập số điện thoại"
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
              placeholder="Nhập mật khẩu"
            />
          </label>
          
          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/accountmanagement")}
              disabled={isLoading}
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? "Đang tạo..." : "Tạo tài khoản"}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default CreateAccount;