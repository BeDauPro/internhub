import React, { useState } from "react";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import "../../styles/pages/admin/AccountManagement.scss";

const AccountManagement = ({ accounts, onAddAccount }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const accountsPerPage = 10;
  const navigate = useNavigate();

  const handleAddAccount = () => {
    navigate("/createaccount");
  };

  const filteredAccounts = accounts.filter(
    (account) =>
      account.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastAccount = currentPage * accountsPerPage;
  const indexOfFirstAccount = indexOfLastAccount - accountsPerPage;
  const currentAccounts = filteredAccounts.slice(indexOfFirstAccount, indexOfLastAccount);

  const totalPages = Math.ceil(filteredAccounts.length / accountsPerPage);

  return (
    <>
      <div className="account-management-container">
        <h1 className="page-title">QUẢN LÝ TÀI KHOẢN</h1>
        <div className="actions-section">
          <form className="search-form">
            <div className="input-group">
              <input
                type="text"
                className="form-control search-bar"
                placeholder="Tìm kiếm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </form>
          <button className="add-account-button" onClick={handleAddAccount}>
            Thêm tài khoản
          </button>
        </div>
        <div className="accounts-table">
          <div className="table-header">
            <div className="header-cell username-cell">Username</div>
            <div className="header-cell email-cell">Email</div>
            <div className="header-cell password-cell">Mật khẩu</div>
            <div className="header-cell createdAt-cell">Ngày tạo</div>
            <div className="header-cell action-cell">Hành động</div>
          </div>
          {currentAccounts.length > 0 ? (
            currentAccounts.map((account, index) => (
              <div className="table-row" key={index}>
                <div className="cell username-cell">{account.username}</div>
                <div className="cell email-cell">{account.email}</div>
                <div className="cell password-cell">{account.password}</div>
                <div className="cell createdAt-cell">{account.createdAt}</div>
                <div className="cell action-cell">
                  <button className="action-button edit-button" title="Chỉnh sửa">
                    <FaEdit />
                  </button>
                  <button className="action-button delete-button" title="Xoá">
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>Không có tài khoản nào.</p>
            </div>
          )}
        </div>
        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`pagination-button ${currentPage === index + 1 ? "active" : ""}`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AccountManagement;
