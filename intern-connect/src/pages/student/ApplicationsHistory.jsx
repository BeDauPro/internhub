import React, { useState, useEffect } from 'react';
import { FaFilter } from "react-icons/fa";
import "../../styles/pages/student/applicationhistory.scss";
import Footer from '../../components/Footer';
import { useNavigate } from "react-router-dom";
import { getStudentApplicationHistory } from '../../services/ApplicationApi';

const ApplicationsHistory = () => {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        status: '',
        timeSort: ''
    });
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const applicationsPerPage = 10;

    // Status mapping from English to Vietnamese
    const statusMapping = {
        'pending': 'Chờ phản hồi',
        'reviewed': 'Phỏng vấn',
        'interview': 'Phỏng vấn',
        'internship': 'Thực tập',
        'completed': 'Hoàn thành'
    };

    // Fetch application history on component mount
    useEffect(() => {
        const fetchApplicationHistory = async () => {
            try {
                setLoading(true);
                const historyData = await getStudentApplicationHistory();

                // Transform API data to match the component's expected format
                const formattedData = historyData.map((app, index) => ({
                    id: app.jobPostingId,
                    position: app.jobTitle,
                    company: app.companyName,
                    dateRange: formatDate(app.applicationDate),
                    status: statusMapping[app.status.toLowerCase()] || app.status
                }));

                setApplications(formattedData);
                setError(null);
            } catch (err) {
                setError(err.data?.message || 'Failed to fetch application history');
                console.error('Error fetching application history:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchApplicationHistory();
    }, []);

    // Helper function to format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');  // Format as DD/MM/YYYY
    };

    // Status priority order
    const statusPriority = {
        'Hoàn thành': 1,
        'Thực tập': 2,
        'Phỏng vấn': 3,
        'Chờ phản hồi': 4
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Chờ phản hồi':
                return 'pending';
            case 'Phỏng vấn':
                return 'reviewed';
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

    // Filter and sort applications based on criteria
    const filteredAndSortedApplications = applications
        .filter(app => {
            if (filters.status === '' || filters.status === 'priority') {
                return true;
            }
            return app.status === filters.status;
        })
        .sort((a, b) => {
            if (filters.status === 'priority') {
                return statusPriority[a.status] - statusPriority[b.status];
            }
            if (filters.timeSort === 'newest') {
                const dateA = a.dateRange.split('/').reverse().join('-');
                const dateB = b.dateRange.split('/').reverse().join('-');
                return new Date(dateB) - new Date(dateA);
            } else if (filters.timeSort === 'oldest') {
                const dateA = a.dateRange.split('/').reverse().join('-');
                const dateB = b.dateRange.split('/').reverse().join('-');
                return new Date(dateA) - new Date(dateB);
            }
            return 0;
        });

    // Pagination logic
    const indexOfLastApplication = currentPage * applicationsPerPage;
    const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
    const currentApplications = filteredAndSortedApplications.slice(indexOfFirstApplication, indexOfLastApplication);

    const totalPages = Math.ceil(filteredAndSortedApplications.length / applicationsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const toggleFilterDropdown = () => {
        setShowFilterDropdown(!showFilterDropdown);
    };

    return (
        <>
            <div className="application-history-container">
                <h1 className="page-title">LỊCH SỬ ỨNG TUYỂN</h1>
                <div className="filter-section">
                    <button className="filter-button" onClick={toggleFilterDropdown}>
                        <FaFilter /> Bộ lọc
                    </button>
                    {showFilterDropdown && (
                        <div className="filter-dropdown">
                            <div className="filter-group">
                                <label>Trạng thái:</label>
                                <select
                                    name="status"
                                    value={filters.status}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Tất cả</option>
                                    <option value="priority">Ưu tiên (Hoàn thành → Chờ phản hồi)</option>
                                    <option value="Hoàn thành">Hoàn thành</option>
                                    <option value="Thực tập">Thực tập</option>
                                    <option value="Phỏng vấn">Phỏng vấn</option>
                                    <option value="Chờ phản hồi">Chờ phản hồi</option>
                                </select>
                            </div>
                            <div className="filter-group">
                                <label>Thời gian:</label>
                                <select
                                    name="timeSort"
                                    value={filters.timeSort}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Mặc định</option>
                                    <option value="newest">Mới nhất</option>
                                    <option value="oldest">Cũ nhất</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="loading">Đang tải dữ liệu...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : (
                    <>
                        <div className="applications-table">
                            <div className="table-header">
                                <div className="header-cell id-cell">ID</div>
                                <div className="header-cell position-cell">Việc làm</div>
                                <div className="header-cell company-cell">Công ty</div>
                                <div className="header-cell date-cell">Thời gian</div>
                                <div className="header-cell status-cell">Trạng thái</div>
                            </div>
                            {currentApplications.length > 0 ? (
                                currentApplications.map((app, index) => (
                                    <div className="table-row" key={index}>
                                        <div className="cell id-cell">{app.id}</div>
                                        <div className="cell position-cell"
                                            onClick={() => navigate(`/jobdetail/${app.id}`)}>
                                            {app.position}
                                        </div>
                                        <div className="cell company-cell">{app.company}</div>
                                        <div className="cell date-cell">{app.dateRange}</div>
                                        <div className="cell status-cell">
                                            <span className={`status-badge ${getStatusStyle(app.status)}`}>
                                                {app.status}
                                            </span>
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
                        {totalPages > 1 && (
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
                        )}
                    </>
                )}
            </div>
            <Footer />
        </>
    );
};

export default ApplicationsHistory;