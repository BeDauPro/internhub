import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFilter, FaFileAlt } from "react-icons/fa";
import "../../styles/pages/employer/applicationemployer.scss";
import Footer from '../../components/Footer';
import NavbarEmployer from '../../components/employer/NavbarEmployer';

const ApplicationEmployer = ({ applicationData }) => {
    const navigate = useNavigate(); 
    const [currentPage, setCurrentPage] = useState(1); // Current page state
    const applicationsPerPage = 10; // Maximum applications per page
    const [applications, setApplications] = useState([]);
    const [filters, setFilters] = useState({
        dateRange: '',
        startDate: '',
        endDate: ''
    });
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    // Define statusRefs and openStatusId
    const statusRefs = useRef({});
    const [openStatusId, setOpenStatusId] = useState(null);

    // Function to toggle the status dropdown
    const toggleStatusDropdown = (id, event) => {
        event.stopPropagation(); // Prevent event bubbling
        setOpenStatusId(openStatusId === id ? null : id);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                openStatusId &&
                statusRefs.current[openStatusId] &&
                !statusRefs.current[openStatusId].contains(event.target)
            ) {
                setOpenStatusId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openStatusId]);

    useEffect(() => {
        if (applicationData) {
            setApplications(applicationData);
        }
    }, [applicationData]);

    // Early return after hooks
    if (!applicationData || applicationData.length === 0) {
        return (
            <div className="error-container">
                <h2>Thông tin sinh viên không khả dụng</h2>
                <button onClick={() => navigate('/')} className="back-btn">Quay lại trang chủ</button>
            </div>
        );
    }

    // Status style mapping
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Chờ phản hồi':
                return 'waiting';
            case 'Phỏng vấn':
                return 'interview';
            case 'Thực tập':
                return 'internship';
            case 'Hoàn thành':
                return 'completed';
            default:
                return '';
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const filteredApplications = applications.filter(app => {
        if (!filters.dateRange || filters.dateRange === 'all') {
            return true;
        }

        const appDate = new Date(app.date.split('/').reverse().join('-'));

        if (filters.dateRange === 'custom') {
            const startDate = filters.startDate ? new Date(filters.startDate) : null;
            const endDate = filters.endDate ? new Date(filters.endDate) : null;

            if (startDate && endDate) {
                return appDate >= startDate && appDate <= endDate;
            } else if (startDate) {
                return appDate >= startDate;
            } else if (endDate) {
                return appDate <= endDate;
            }
            return true;
        }

        const today = new Date();
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 7);

        const lastMonth = new Date();
        lastMonth.setMonth(today.getMonth() - 1);

        if (filters.dateRange === 'today') {
            return appDate.toDateString() === today.toDateString();
        } else if (filters.dateRange === 'lastWeek') {
            return appDate >= lastWeek;
        } else if (filters.dateRange === 'lastMonth') {
            return appDate >= lastMonth;
        }

        return true;
    });

    const toggleFilterDropdown = () => {
        setShowFilterDropdown(!showFilterDropdown);
    };

    const handleStatusChange = (id, newStatus, event) => {
        event.stopPropagation(); // Prevent event bubbling
        setApplications(applications.map(app =>
            app.id === id ? { ...app, status: newStatus } : app
        ));
        setOpenStatusId(null); // Close the dropdown after status change
    };

    // Pagination logic
    const indexOfLastApplication = currentPage * applicationsPerPage;
    const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
    const currentApplications = filteredApplications.slice(indexOfFirstApplication, indexOfLastApplication);

    const totalPages = Math.ceil(filteredApplications.length / applicationsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <NavbarEmployer />
            <div className="application-management-container">
                <h1 className="page-title">QUẢN LÝ CÁC ỨNG VIÊN</h1>

                <div className="filter-section">
                    <button className="filter-button" onClick={toggleFilterDropdown}>
                        <FaFilter /> Bộ lọc
                    </button>
                    {showFilterDropdown && (
                        <div className="filter-dropdown">
                            <div className="filter-group">
                                <label>Thời gian:</label>
                                <select 
                                    name="dateRange" 
                                    value={filters.dateRange} 
                                    onChange={handleFilterChange}
                                >
                                    <option value="all">Tất cả</option>
                                    <option value="today">Hôm nay</option>
                                    <option value="lastWeek">7 ngày qua</option>
                                    <option value="lastMonth">30 ngày qua</option>
                                    <option value="custom">Tùy chỉnh</option>
                                </select>
                            </div>

                            {filters.dateRange === 'custom' && (
                                <>
                                    <div className="filter-group">
                                        <label>Từ ngày:</label>
                                        <input 
                                            type="date" 
                                            name="startDate" 
                                            value={filters.startDate} 
                                            onChange={handleFilterChange}
                                        />
                                    </div>
                                    <div className="filter-group">
                                        <label>Đến ngày:</label>
                                        <input 
                                            type="date" 
                                            name="endDate" 
                                            value={filters.endDate} 
                                            onChange={handleFilterChange}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className="applications-table">
                    <div className="table-header">
                        <div className="header-cell id-cell">ID</div>
                        <div className="header-cell position-cell">Việc làm</div>
                        <div className="header-cell student-cell">Sinh viên</div>
                        <div className="header-cell date-cell">Ngày nộp đơn</div>
                        <div className="header-cell file-cell">Hồ sơ</div>
                        <div className="header-cell status-cell">Trạng thái</div>
                    </div>

                    {currentApplications.length > 0 ? (
                        currentApplications.map((app, index) => (
                            <div className="table-row" key={index}>
                                <div className="cell id-cell">{app.id}</div>
                                <div className="cell position-cell">{app.position}</div>
                                <div className="cell student-cell">{app.student}</div>
                                <div className="cell date-cell">{app.date}</div>
                                <div className="cell file-cell">
                                    <button 
                                        className="file-button" 
                                        onClick={() => navigate("/studentprofile")}
                                        title="Xem hồ sơ"
                                    >
                                        <FaFileAlt />
                                    </button>
                                </div>
                                <div className="cell status-cell">
                                    <div 
                                        className="status-dropdown"
                                        ref={el => statusRefs.current[app.id] = el}
                                    >
                                        <div 
                                            className={`status-badge ${getStatusStyle(app.status)}`}
                                            onClick={(e) => toggleStatusDropdown(app.id, e)}
                                        >
                                            {app.status} <span className="dropdown-arrow">▼</span>
                                        </div>
                                        
                                        {openStatusId === app.id && (
                                            <div className="status-dropdown-menu">
                                                <div 
                                                    className="status-option waiting"
                                                    onClick={(e) => handleStatusChange(app.id, 'Chờ phản hồi', e)}
                                                >
                                                    <span className="status-dot waiting-dot"></span>
                                                    Chờ phản hồi
                                                </div>
                                                <div 
                                                    className="status-option interview"
                                                    onClick={(e) => handleStatusChange(app.id, 'Phỏng vấn', e)}
                                                >
                                                    <span className="status-dot interview-dot"></span>
                                                    Phỏng vấn
                                                </div>
                                                <div 
                                                    className="status-option internship"
                                                    onClick={(e) => handleStatusChange(app.id, 'Thực tập', e)}
                                                >
                                                    <span className="status-dot internship-dot"></span>
                                                    Thực tập
                                                </div>
                                                <div 
                                                    className="status-option completed"
                                                    onClick={(e) => handleStatusChange(app.id, 'Hoàn thành', e)}
                                                >
                                                    <span className="status-dot completed-dot"></span>
                                                    Hoàn thành
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-results">
                            <p>Không tìm thấy kết quả phù hợp.</p>
                        </div>
                    )}
                </div>

                {/* Pagination controls */}
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

export default ApplicationEmployer;
