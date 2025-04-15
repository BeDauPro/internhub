import React, { useState, useEffect } from "react";
import { FaTrash, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import "../../styles/pages/admin/AccountManagement.scss";

// Import API methods
import { 
  getAllEmployers, 
  deleteEmployerAccount 
} from '../../services/adminApi'; // Adjust the import path as needed

const AccountManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const accountsPerPage = 10;
  const navigate = useNavigate();

  // Fetch accounts when component mounts
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const fetchedAccounts = await getAllEmployers();
        console.log("Fetched accounts:", fetchedAccounts); // Debug log
        setAccounts(fetchedAccounts);
      } catch (error) {
        console.error("Error fetching accounts:", error);
        // Optional: Add error handling toast or alert
      }
    };

    fetchAccounts();
  }, []);

  const handleAddAccount = () => {
    navigate("/createaccount");
  };

  // Handle Delete Account
  const handleDeleteAccount = async (accountId) => {
    console.log("Trying to delete account with ID:", accountId);
    
    try {
      // Optional: Add confirmation dialog
      const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?");
      
      if (confirmDelete) {
        await deleteEmployerAccount(accountId);
        
        // Remove the deleted account from local state
        setAccounts(accounts.filter(account => account.id !== accountId));
        
        // Optional: Add success toast
        alert("Xóa tài khoản thành công!");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      // Optional: Add error handling toast or alert
      alert("Không thể xóa tài khoản. " + (error.data?.error || error.data?.message || "Lỗi không xác định"));
    }
  };

  // Filter accounts
  const filteredAccounts = accounts.filter(
    (account) =>
      (account.userName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (account.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  // Pagination logic
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
            <div className="header-cell password-cell">Số Điện Thoại</div>
            <div className="header-cell createdAt-cell">Ngày tạo</div>
            <div className="header-cell action-cell">Hành động</div>
          </div>
          {currentAccounts.length > 0 ? (
            currentAccounts.map((account, index) => (
              <div className="table-row" key={account.id || index}>
                <div className="cell username-cell">{account.userName}</div>
                <div className="cell email-cell">{account.email}</div>
                <div className="cell password-cell">{account.phone}</div>
                <div className="cell createdAt-cell">
                  {new Date(account.createdAt).toLocaleDateString()}
                </div>
                <div className="cell action-cell">
                  <button 
                    className="action-button delete-button" 
                    title="Xoá"
                    onClick={() => handleDeleteAccount(account.id)}
                  >
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