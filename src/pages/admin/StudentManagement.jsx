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
                            <p>Không có bộ lọc nào khả dụng.</p>
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

                    {managementStudent.length > 0 ? (
                        managementStudent.map((student, index) => (
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
            </div>
            <Footer />
        </>
    );
};

export default StudentManagement;
