import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFilter, FaFileAlt } from "react-icons/fa";
import "../../styles/pages/employer/applicationemployer.scss";
import Footer from '../../components/Footer';
import { updateApplicationStatus, getCandidatesForEmployer } from '../../services/ApplicationApi';
import { getStudentById } from '../../services/studentApi';

const ApplicationEmployer = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const applicationsPerPage = 10;
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        status: '',
        dateRange: '',
        startDate: '',
        endDate: ''
    });
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    // Define statusRefs and openStatusId
    const statusRefs = useRef({});
    const [openStatusId, setOpenStatusId] = useState(null);

    // Status mapping from English to Vietnamese
    const statusMapping = {
        'pending': 'Chờ phản hồi',
        'reviewed': 'Phỏng vấn',
        'internship': 'Thực tập',
        'completed': 'Hoàn thành'
    };

    // Status priority order
    const statusPriority = {
        'Hoàn thành': 1,
        'Thực tập': 2,
        'Phỏng vấn': 3,
        'Chờ phản hồi': 4
    };

    // Fetch data from API when component mounts
    useEffect(() => {
        fetchCandidates();
    }, []);

    const fetchCandidates = async () => {
        try {
            setLoading(true);
            const response = await getCandidatesForEmployer();

            console.log("Response from API:", response);

            const formattedApplications = response.map(candidate => {
                console.log("Mapping candidate:", candidate.applicationId, "Status:", candidate.status);
                return {
                    id: candidate.applicationId,
                    position: candidate.jobTitle,
                    student: candidate.studentName,
                    date: formatDate(candidate.applicationDate),
                    status: statusMapping[candidate.status?.toLowerCase()] || 'Chờ phản hồi',
                    studentId: candidate.studentId
                };
            });

            setApplications(formattedApplications);
            setError(null);
        } catch (err) {
            console.error("Error fetching candidates:", err);
            setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    // Helper function to format date from API to DD/MM/YYYY
    const formatDate = (dateString) => {
        if (!dateString) return '';

        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return dateString;
        }

        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    };

    // Map API status values to display values based on your enum
    const mapStatusFromApi = (apiStatus) => {
        const statusMap = {
            'pending': 'Chờ phản hồi',
            'reviewed': 'Phỏng vấn',
            'internship': 'Thực tập',
            'completed': 'Hoàn thành'
        };

        return statusMap[apiStatus?.toLowerCase()] || 'Chờ phản hồi';
    };

    const mapStatusToApi = (statusText) => {
        const statusMap = {
            'Chờ phản hồi': 0,
            'Phỏng vấn': 1,
            'Thực tập': 2,
            'Hoàn thành': 3
        };
        return statusMap[statusText] ?? 0;
    };

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

    const filteredApplications = applications
        .filter(app => {
            // Filter by status
            const statusMatch = !filters.status || filters.status === 'priority' || app.status === filters.status;

            // Filter by date
            let dateMatch = true;
            if (filters.dateRange && filters.dateRange !== 'all') {
                const appDate = new Date(app.date.split('/').reverse().join('-'));
                const today = new Date();
                const lastWeek = new Date();
                lastWeek.setDate(today.getDate() - 7);
                const lastMonth = new Date();
                lastMonth.setMonth(today.getMonth() - 1);

                if (filters.dateRange === 'today') {
                    dateMatch = appDate.toDateString() === today.toDateString();
                } else if (filters.dateRange === 'lastWeek') {
                    dateMatch = appDate >= lastWeek;
                } else if (filters.dateRange === 'lastMonth') {
                    dateMatch = appDate >= lastMonth;
                } else if (filters.dateRange === 'custom') {
                    const startDate = filters.startDate ? new Date(filters.startDate) : null;
                    const endDate = filters.endDate ? new Date(filters.endDate) : null;

                    if (startDate && endDate) {
                        dateMatch = appDate >= startDate && appDate <= endDate;
                    } else if (startDate) {
                        dateMatch = appDate >= startDate;
                    } else if (endDate) {
                        dateMatch = appDate <= endDate;
                    }
                }
            }

            return statusMatch && dateMatch;
        })
        .sort((a, b) => {
            // Sort by priority status if selected
            if (filters.status === 'priority') {
                return statusPriority[a.status] - statusPriority[b.status];
            }
            return 0;
        });

    const toggleFilterDropdown = () => {
        setShowFilterDropdown(!showFilterDropdown);
    };

    // In your frontend component, modify handleStatusChange:
    const handleStatusChange = async (id, newStatus, event) => {
        event.stopPropagation();

        try {
            const apiStatus = mapStatusToApi(newStatus);
            console.log(`Updating application ${id} status to:`, apiStatus);

            await updateApplicationStatus(id, apiStatus);

            // Cập nhật trạng thái cục bộ
            setApplications(prevApplications =>
                prevApplications.map(app =>
                    app.id === id ? { ...app, status: newStatus } : app
                )
            );
            alert(`Trạng thái của ứng viên ID ${id} đã được cập nhật thành "${newStatus}".`);
            // Gọi lại API để đảm bảo dữ liệu đồng bộ
            await fetchCandidates();

            setOpenStatusId(null);
        } catch (err) {
            console.error("Error updating application status:", err);
            alert("Không thể cập nhật trạng thái. Vui lòng thử lại sau.");
        }
    };
    // Pagination logic
    const indexOfLastApplication = currentPage * applicationsPerPage;
    const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
    const currentApplications = filteredApplications.slice(indexOfFirstApplication, indexOfLastApplication);

    const totalPages = Math.ceil(filteredApplications.length / applicationsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleViewProfile = async (studentId) => {
        if (!studentId) {
            console.error("Student ID is undefined");
            alert("Không thể xem hồ sơ vì thiếu ID sinh viên.");
            return;
        }

        try {
            // Sử dụng API để lấy thông tin sinh viên
            const studentData = await getStudentById(studentId);
            console.log("Student Data:", studentData);

            // Chuyển hướng đến trang chi tiết sinh viên với dữ liệu đã lấy được
            navigate(`/students/${studentId}`, {
                state: {
                    studentData
                }
            });
        } catch (error) {
            console.error("Error fetching student profile:", error);
            if (error.response && error.response.status === 404) {
                alert("Không tìm thấy sinh viên với ID này.");
            } else {
                alert("Không thể tải thông tin sinh viên. Vui lòng thử lại sau.");
            }
        }
    };

    // Render loading or error states
    if (loading) {
        return <div className="loading-container">Đang tải dữ liệu...</div>;
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>{error}</h2>
                <button onClick={fetchCandidates} className="retry-btn">Thử lại</button>
            </div>
        );
    }

    return (
        <>
            <div className="application-management-container">
                <h1 className="page-title">QUẢN LÝ CÁC ỨNG VIÊN</h1>

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
                        <div className="header-cell id-cell">Aplication ID</div>
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
                                        onClick={() => handleViewProfile(app.studentId)}
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
            </div>
            <Footer />
        </>
    );
};

export default ApplicationEmployer;