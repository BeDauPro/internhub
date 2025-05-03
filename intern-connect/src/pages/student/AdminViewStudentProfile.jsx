// src/pages/admin/AdminViewStudentProfile.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    FaArrowLeft
} from 'react-icons/fa';
import Footer from '../../components/Footer';
import { getStudentById } from '../../services/studentApi';
import Evaluate from './Evaluate';
const AdminViewStudentProfile = () => {
    const { studentId } = useParams();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [role, setRole] = useState(null);
    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                setLoading(true);
                const data = await getStudentById(studentId);
                setStudent(data);
                setLoading(false);
            } catch (err) {
                console.error('Error loading student profile:', err);
                setError('Không thể tải thông tin sinh viên. Vui lòng thử lại sau.');
                setLoading(false);
            }
        };

        if (studentId) {
            fetchStudentData();
        }
    }, [studentId]);

    if (loading) {
        return (
            <div className="loading-container">
                <p>Đang tải thông tin sinh viên...</p>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="error-container">
                <h2>Không tìm thấy thông tin sinh viên</h2>
            </div>
        );
    }

    return (
        <>
            <div className="profile-container admin-view">
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
                    </div>
                    <Evaluate  studentId={studentId} />
                </div>        
            </div>
            <Footer />
        </>
    );
};

export default AdminViewStudentProfile;