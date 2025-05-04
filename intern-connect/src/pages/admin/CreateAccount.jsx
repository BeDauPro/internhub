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
    phone: "",
  });
  
  // More detailed error handling
  const [errors, setErrors] = useState({
    userName: "",
    email: "",
    password: "",
    phone: "",
    general: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    if (!email) return "Email là bắt buộc";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Email không hợp lệ";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Mật khẩu là bắt buộc";
    // Check for at least one uppercase, one lowercase, one digit, and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(password)) {
      return "Mật khẩu phải chứa ít nhất một chữ cái viết hoa, một chữ cái viết thường, một số và một ký tự đặc biệt.";
    }
    return "";
  };

  const validatePhone = (phone) => {
    if (!phone) return "Số điện thoại là bắt buộc";
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(phone)) return "Số điện thoại không hợp lệ";
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAccount({ ...newAccount, [name]: value });
    
    // Clear error for the field being edited
    setErrors({ ...errors, [name]: "", general: "" });
  };

  const validateForm = () => {
    const newErrors = {
      
      email: validateEmail(newAccount.email),
      password: validatePassword(newAccount.password),
      phone: validatePhone(newAccount.phone),
      general: ""
    };

    setErrors(newErrors);
    
    // Return true if form is valid (no errors)
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    setIsLoading(true);

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
      
      // Success notification
      alert("Tạo tài khoản thành công!");
      
      // Navigate back to account management
      navigate("/accountmanagement");
    } catch (err) {
      // Handle API errors
      console.error("Error creating account:", err);
      
      // Extract error message from API response
      if (err.data?.errors) {
        // Handle validation errors from API
        const apiErrors = err.data.errors;
        const newErrors = { ...errors };

        // Map API errors to form fields
        Object.keys(apiErrors).forEach(key => {
          if (key in newErrors) {
            newErrors[key] = apiErrors[key][0];
          } else {
            newErrors.general = apiErrors[key][0];
          }
        });

        setErrors(newErrors);
      } else {
        // General error
        setErrors({ 
          ...errors, 
          general: err.data?.error || "Không thể tạo tài khoản. Vui lòng thử lại." 
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="create-account-container">
        <h1 className="page-title">Tạo tài khoản mới</h1>
        <form className="create-account-form" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="error-message">{errors.general}</div>
          )}
          
          <label>
            Username:
            <input
              type="text"
              name="userName"
              value={newAccount.userName}
              onChange={handleInputChange}
              className={errors.userName ? "input-error" : ""}
              placeholder="Nhập username (thêm 'company' sau tên)"
            />
            {errors.userName && (
              <div className="field-error">{errors.userName}</div>
            )}
            <small>Lưu ý: Username sẽ tự động thêm 'company' nếu chưa có</small>
          </label>
          
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={newAccount.email}
              onChange={handleInputChange}
              className={errors.email ? "input-error" : ""}
              placeholder="Nhập email"
            />
            {errors.email && (
              <div className="field-error">{errors.email}</div>
            )}
          </label>
          
          <label>
            Số điện thoại:
            <input
              type="tel"
              name="phone"
              value={newAccount.phone}
              onChange={handleInputChange}
              className={errors.phone ? "input-error" : ""}
              placeholder="Nhập số điện thoại"
            />
            {errors.phone && (
              <div className="field-error">{errors.phone}</div>
            )}
          </label>
          
          <label>
            Mật khẩu:
            <input
              type="password"
              name="password"
              value={newAccount.password}
              onChange={handleInputChange}
              className={errors.password ? "input-error" : ""}
              placeholder="Nhập mật khẩu"
            />
            {errors.password && (
              <div className="field-error">{errors.password}</div>
            )}
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