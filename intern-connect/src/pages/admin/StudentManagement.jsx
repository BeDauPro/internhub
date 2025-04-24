import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFilter, FaFileAlt } from "react-icons/fa";
import "../../styles/pages/admin/studentmanagement.scss";
import Footer from '../../components/Footer';
import { getAllStudentsForAdmin } from '../../services/ApplicationApi';

const StudentManagement = () => {
    const navigate = useNavigate();

    const [managementStudent, setManagementStudent] = useState([]);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 10;
    const [studentIdFilter, setStudentIdFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState(""); // New status filter state
    const [sortOrder, setSortOrder] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                const data = await getAllStudentsForAdmin();
                setManagementStudent(data);
                setLoading(false);
            } catch (err) {
                console.error("Lỗi khi lấy dữ liệu sinh viên:", err);
                setError("Không thể lấy dữ liệu sinh viên. Vui lòng thử lại sau.");
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    if (loading) {
        return <div className="loading-container">Đang tải dữ liệu...</div>;
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>{error}</h2>
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

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
    };

    const handleSortOrderChange = (e) => {
        setSortOrder(e.target.value);
    };

    // Status priority order based on StudentStatus enum
    const statusPriority = {
        'Completed': 1,    // Hoàn thành - Ưu tiên cao nhất
        'Internship': 2,   // Đang thực tập
        'Reviewed': 3,     // Đã xem xét
        'Pending': 4       // Đang chờ xử lý - Ưu tiên thấp nhất
    };

    // Get status name from numeric value
    const getStatusName = (statusValue) => {
        switch (statusValue) {
            case 0: return 'Pending';
            case 1: return 'Reviewed';
            case 2: return 'Internship';
            case 3: return 'Completed';
            default: return 'Unknown';
        }
    };

    // Get status name in Vietnamese
    const getStatusNameVietnamese = (statusName) => {
        switch (statusName) {
            case 'Pending': return 'Đang chờ xử lý';
            case 'Reviewed': return 'Đã xem xét';
            case 'Internship': return 'Đang thực tập';
            case 'Completed': return 'Hoàn thành';
            default: return 'Không xác định';
        }
    };

    // Filter and sort students
    const filteredAndSortedStudents = managementStudent
        .filter(student => {
            const idMatch = studentIdFilter === "" || student.studentId.toString().includes(studentIdFilter);
            const statusMatch = statusFilter === "" ||
                (statusFilter === "priority" ? true : getStatusName(student.status) === statusFilter);
            return idMatch && statusMatch;
        })
        .sort((a, b) => {
            if (statusFilter === "priority") {
                return statusPriority[getStatusName(a.status)] - statusPriority[getStatusName(b.status)];
            }

            if (sortOrder === "asc") {
                return a.studentId.toString().localeCompare(b.studentId.toString());
            } else if (sortOrder === "desc") {
                return b.studentId.toString().localeCompare(a.studentId.toString());
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

    const viewStudentProfile = (studentId) => {
        navigate(`/studentprofile/${studentId}`);
    };

    // Function to determine status style classes
    const getStatusStyle = (statusValue) => {
        const statusName = getStatusName(statusValue);
        switch (statusName) {
            case 'Pending':
                return 'pending';
            case 'Reviewed':
                return 'reviewed';
            case 'Internship':
                return 'internship';
            case 'Completed':
                return 'completed';
            default:
                return '';
        }
    };

    return (
        <>
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
                                    placeholder="Nhập ID sinh viên"
                                    value={studentIdFilter}
                                    onChange={handleStudentIdFilterChange}
                                />
                            </div>
                            <div className="filter-group">
                                <label>Trạng thái:</label>
                                <select
                                    value={statusFilter}
                                    onChange={handleStatusFilterChange}
                                >
                                    <option value="">Tất cả</option>
                                    <option value="priority">Ưu tiên (Hoàn thành → Đang chờ)</option>
                                    <option value="Completed">Hoàn thành</option>
                                    <option value="Internship">Đang thực tập</option>
                                    <option value="Reviewed">Đã xem xét</option>
                                    <option value="Pending">Đang chờ xử lý</option>
                                </select>
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
                        <div className="header-cell company-cell">Sinh Viên</div>
                        <div className="header-cell position-cell">GPA</div>
                        <div className="header-cell student-cell">Trạng Thái</div>
                        <div className="header-cell file-cell">Hồ sơ</div>
                    </div>

                    {currentStudents.length > 0 ? (
                        currentStudents.map((student, index) => (
                            <div className="table-row" key={index}>
                                <div className="cell id-cell">{student.studentId}</div>
                                <div className="cell company-cell">{student.studentName}</div>
                                <div className="cell position-cell">{student.gpa}</div>
                                <div className="cell student-cell">
                                    <span className={`status-badge ${getStatusStyle(student.status)}`}>
                                        {getStatusNameVietnamese(getStatusName(student.status))}
                                    </span>
                                </div>
                                <div className="cell file-cell">
                                    <button
                                        className="file-button"
                                        onClick={() => viewStudentProfile(student.studentId)}
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