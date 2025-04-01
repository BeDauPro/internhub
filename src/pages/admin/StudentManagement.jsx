import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFilter, FaFileAlt } from "react-icons/fa";
import "../../styles/pages/admin/studentmanagement.scss";
import NavbarAdmin from '../../components/admin/NavbarAdmin';
import Footer from '../../components/Footer';

const StudentManagement = ({ studentsData }) => {
    const navigate = useNavigate();

    const [managementStudent, setManagementStudent] = useState([]);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); 
    const studentsPerPage = 10; 
    const [studentIdFilter, setStudentIdFilter] = useState(""); // New state for student ID filter
    const [sortOrder, setSortOrder] = useState(""); // New state for sorting order

    useEffect(() => {
        if (studentsData) {
            setManagementStudent(studentsData);
        }
    }, [studentsData]);

    if (!studentsData) {
        return (
            <div className="error-container">
                <h2>Thông tin sinh viên không khả dụng</h2>
                <button onClick={() => navigate('/')} className="back-btn">Quay lại trang chủ</button>
            </div>
        );
    }
    
    const toggleFilterDropdown = () => {
        setShowFilterDropdown(!showFilterDropdown);
    };

    const handleStudentIdFilterChange = (e) => {
        setStudentIdFilter(e.target.value);
    };

    const handleSortOrderChange = (e) => {
        setSortOrder(e.target.value);
    };

    // Filter and sort students
    const filteredAndSortedStudents = managementStudent
        .filter(student => studentIdFilter === "" || student.id.includes(studentIdFilter))
        .sort((a, b) => {
            if (sortOrder === "asc") {
                return a.id.localeCompare(b.id);
            } else if (sortOrder === "desc") {
                return b.id.localeCompare(a.id);
            }
            return 0;
        });

    // Pagination logic
    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = filteredAndSortedStudents.slice(indexOfFirstStudent, indexOfLastStudent);

    const totalPages = Math.ceil(filteredAndSortedStudents.length / studentsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <NavbarAdmin />
            <div className="student-management-container">
                <h1 className="page-title">QUẢN LÝ SINH VIÊN SAU THỰC TẬP</h1>

                <div className="filter-section">
                    <button className="filter-button" onClick={toggleFilterDropdown}>
                        <FaFilter /> Bộ lọc
                    </button>
                    {showFilterDropdown && (
                        <div className="filter-dropdown">
                            <div className="filter-group">
                                <label>Lọc theo ID sinh viên:</label>
                                <input
                                    type="text"
                                    placeholder="Nhập ID sinh viên (e.g., 21T1020310)"
                                    value={studentIdFilter}
                                    onChange={handleStudentIdFilterChange}
                                />
                            </div>
                            <div className="filter-group">
                                <label>Sắp xếp theo ID:</label>
                                <select value={sortOrder} onChange={handleSortOrderChange}>
                                    <option value="">Mặc định</option>
                                    <option value="asc">Tăng dần</option>
                                    <option value="desc">Giảm dần</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                <div className="students-table">
                    <div className="table-header">
                        <div className="header-cell id-cell">ID Sinh viên</div>
                        <div className="header-cell company-cell">Công ty</div>
                        <div className="header-cell position-cell">Việc làm</div>
                        <div className="header-cell student-cell">Sinh viên</div>
                        <div className="header-cell file-cell">Hồ sơ</div>
                    </div>

                    {currentStudents.length > 0 ? (
                        currentStudents.map((student, index) => (
                            <div className="table-row" key={index}>
                                <div className="cell id-cell">{student.id}</div>
                                <div className="cell company-cell">{student.company}</div>
                                <div className="cell position-cell">{student.position}</div>
                                <div className="cell student-cell">{student.student}</div>
                                <div className="cell file-cell">
                                    <button
                                        className="file-button"
                                        onClick={() => navigate("/studentprofile")}
                                        title="Xem hồ sơ"
                                    >
                                        <FaFileAlt />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-results">
                            <p>Không tìm thấy kết quả phù hợp.</p>
                        </div>
                    )}
                </div>

                <div className="pagination">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default StudentManagement;
