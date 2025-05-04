// src/pages/student/StudentProfile.jsx
import React, { useEffect, useState } from 'react';
import '../../styles/pages/student/studentprofile.scss';
import {
    AiOutlineMail,
    AiOutlineHome,
    AiOutlinePhone,
    AiOutlineGithub,
    AiOutlineFileText,
} from 'react-icons/ai';
import {
    FaGraduationCap,
    FaBirthdayCake,
    FaMale,
    FaLanguage,
} from 'react-icons/fa';
import Footer from '../../components/Footer';
import Evaluate from './Evaluate';
import { getStudentProfile} from '../../services/studentApi';

const StudentProfile = () => {
    const [student, setStudent] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [role, setRole] = useState(null);
    
    useEffect(() => {
        const userRole = localStorage.getItem('role'); // "Student" hoặc "Employer"
        setRole(userRole);

        const fetchData = async () => {
            try {
                const data = await getStudentProfile();
                if (!data) {
                    setIsCreating(true); // Nếu không có thông tin sinh viên, chuyển qua tạo tài khoản mới
                } else {
                    setStudent(data); // Đã có thông tin sinh viên
                }
                console.log('Student data:', data);
            } catch (err) {
                console.error('Error loading profile: ', err);
                alert('Không thể tải thông tin sinh viên. Vui lòng thử lại sau.');
            }
        };
        fetchData();
    }, []);

    // Nếu không có thông tin sinh viên và không đang tạo mới, hiển thị thông báo lỗi
    if (!student && !isCreating) {
        return (
            <div className="error-container">
                <h2>Chưa có thông tin tài khoản</h2>
                <button
                    onClick={() => window.location.href = '/profileform'}
                    className="create-account-btn"
                >
                    Tạo mới tài khoản
                </button>
            </div>
        );
    }

    // Nếu thông tin sinh viên chưa được tải về, hiển thị trạng thái tải
    if (!student) {
        return <p>Đang tải...</p>;
    }

    return (
        <>
            <div className="profile-container">
                <div className="profile-card">
                    <img
                        className="profile-image"
                        src={student.profilePicture ? `${student.profilePicture}?t=${new Date().getTime()}` : '/default-avatar.png'}
                        alt="Avatar"
                    />

                    <h2>{student.fullName}</h2>
                    <p className="student-id">ID Sinh viên: {student.id}</p>

                    <div className="status">
                        <span className="status-label">Trạng thái việc làm</span>
                        <span className="status-badge">{student.status}</span>
                    </div>

                    <section className="contact-section">
                        <h3>Thông tin liên hệ</h3>
                        <p><AiOutlineMail /> {student.schoolEmail}</p>
                        <p><AiOutlineHome /> {student.address}</p>
                        <p><AiOutlinePhone /> {student.phone}</p>
                        <p><FaBirthdayCake /> {student.dateOfBirth}</p>
                        <p><FaMale /> {student.gender}</p>
                    </section>
                </div>

                <div className="profile-evaluate-container">
                    <div className="profile-details">
                        <section className="section">
                            <h3>Giới thiệu bản thân</h3>
                            <p>{student.bio || 'Chưa có mô tả'}</p>
                        </section>
                        <section className="section">
                            <h3>Trình độ học vấn</h3>
                            <p><FaGraduationCap /> {student.education || 'Không có thông tin học vấn nào được liệt kê'}</p>
                        </section>
                        <section className="section">
                            <h3>Thông tin khác</h3>
                            <p>
                                <AiOutlineGithub /> <strong>Github:</strong>{' '}
                                {student.githubProfile ? (
                                    <a href={student.githubProfile} target="_blank" rel="noopener noreferrer">
                                        {student.githubProfile}
                                    </a>
                                ) : (
                                    'Chưa có'
                                )}
                            </p>
                            <p><FaGraduationCap /> <strong>GPA:</strong> {student.gpa || 'N/A'}</p>
                            <p><FaLanguage /> <strong>Ngôn ngữ:</strong> {student.languages || 'N/A'}</p>
                        </section>

                        <section className="section">
                            <h3>Kỹ năng chuyên môn</h3>
                            <p>{student.skills || 'Không có kỹ năng nào được liệt kê'}</p>
                        </section>

                        <section className="cv-section">
                            <h3>CV cá nhân:</h3>
                            <div className="cv-upload">
                                <AiOutlineFileText className="cv-icon" />
                                {student.cvFile ? (
                                    <a href={student.cvFile} target="_blank" rel="noopener noreferrer">Xem CV</a>
                                ) : (
                                    <span>Chưa tải lên</span>
                                )}
                            </div>
                        </section>

                        {/* Nút chỉnh sửa chỉ dành cho sinh viên */}
                        {role === 'Student' && (
                            <div className="profile-actions">
                                <button onClick={() => window.location.href = '/profileform'} className="edit-btn">
                                    Chỉnh sửa
                                </button>
                            </div>
                        )}
                    </div>

                    {(role === "Employer" || role === "Student") && <Evaluate studentId={student.id} />}

                </div>
            </div>
            <Footer />
        </>
    );
};

export default StudentProfile;
