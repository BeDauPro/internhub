import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import '../../styles/pages/employer/editjob.scss';
import Footer from '../../components/Footer';
import {
    getEmployerProfile
} from '../../services/employerApi';
import axios from 'axios';

const EditJob = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [employerId, setEmployerId] = useState('');

    const [formData, setFormData] = useState({
        companyName: '',
        location: '',
        field: '',
        jobTitle: '',
        jobType: 'Full-time',
        salary: '',
        experience: '',
        jobDescription: '',
        jobRequirements: '',
        languages: [],
        vacancies: 1,
        deadline: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmployerInfo = async () => {
            try {
                const data = await getEmployerProfile();
                const { companyName, address, industry, employerId } = data;
                setEmployerId(employerId); 
                setFormData(prev => ({
                    ...prev,
                    companyName,
                    location: address,
                    field: industry || 'Chưa xác định',
                }));
            } catch (err) {
                console.error('Lỗi khi lấy thông tin employer:', err);
                setError('Không thể lấy thông tin công ty.');
            }
        };

        const fetchJobInfo = async () => {
            if (!id) {
                setError('ID công việc không hợp lệ.');
                return;
            }

            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`https://localhost:7286/api/Employer/JobPosting/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const job = res.data;
                setFormData(prev => ({
                    ...prev,
                    jobTitle: job.JobTitle || '',
                    jobType: job.WorkType || 'Full-time',
                    salary: job.Salary || '',
                    experience: job.ExperienceRequired || '',
                    jobDescription: job.JobDesc || '',
                    jobRequirements: job.SkillsRequired || '',
                    languages: job.LanguagesRequired ? job.LanguagesRequired.split(',').map(lang => lang.trim()) : [],
                    vacancies: job.Vacancies || 1,
                    deadline: job.ApplicationDeadline ? job.ApplicationDeadline.slice(0, 10) : ''
                }));
            } catch (err) {
                console.error('Lỗi khi lấy thông tin job:', err);
                setError('Không thể lấy thông tin công việc.');
            }
        };

        fetchEmployerInfo();
        if (id) fetchJobInfo();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleArrayChange = (e, field) => {
        const value = e.target.value.split(',').map(item => item.trim());
        setFormData({ ...formData, [field]: value });
    };

    const validateForm = () => {
        if (!formData.jobTitle.trim()) return setError('Tiêu đề công việc là bắt buộc'), false;
        if (!formData.jobType.trim()) return setError('Loại công việc là bắt buộc'), false;
        if (!formData.deadline) return setError('Hạn cuối là bắt buộc'), false;

        const deadlineDate = new Date(formData.deadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (deadlineDate <= today) return setError('Hạn cuối phải là ngày trong tương lai'), false;

        return true;
    };

    const handleSave = async () => {
        if (!id) {
            setError('ID công việc không hợp lệ.');
            return;
        }

        if (!validateForm()) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('JobTitle', formData.jobTitle);
            formDataToSend.append('WorkType', formData.jobType);
            formDataToSend.append('ApplicationDeadline', new Date(formData.deadline).toISOString());
            if (formData.salary) formDataToSend.append('Salary', formData.salary);
            if (formData.experience) formDataToSend.append('ExperienceRequired', formData.experience);
            if (formData.jobDescription) formDataToSend.append('JobDesc', formData.jobDescription);
            if (formData.jobRequirements) formDataToSend.append('SkillsRequired', formData.jobRequirements);
            if (formData.languages.length > 0) formDataToSend.append('LanguagesRequired', formData.languages.join(','));
            if (formData.vacancies) formDataToSend.append('Vacancies', formData.vacancies);
            if (formData.field) formDataToSend.append('industry', formData.field);
            if (formData.location) formDataToSend.append('Location', formData.location);
            if (formData.employerId) formDataToSend.append('EmployerId', formData.employerId); // Ensure EmployerId is included

            const token = localStorage.getItem('token');
            const response = await axios.put(`https://localhost:7286/api/Employer/JobPosting/${id}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            navigate('/manageposts', {
                state: {
                    updatedJob: {
                        id: response.data.JobPostingId,
                        title: response.data.JobTitle,
                        type: response.data.WorkType,
                        typeClass: response.data.WorkType.toLowerCase().replace(/ /g, '-'),
                        company: response.data.CompanyName,
                        location: response.data.Location,
                        quantity: response.data.Vacancies
                    }
                }
            });
        } catch (err) {
            console.error('Lỗi khi cập nhật bài đăng:', err);
            setError('Có lỗi xảy ra khi cập nhật bài đăng.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="job-detail-container">
                {error && (
                    <div className="error-message">
                        <p>{error}</p>
                        <button onClick={() => setError(null)}>×</button>
                    </div>
                )}
                <div className="job-header">
                    <div className="company-info">
                        <div className="company-details">
                            <p>Tên công ty: <span>{formData.companyName}</span></p>
                            <p>Địa chỉ: <span>{formData.location}</span></p>
                            <p className="job-field">Lĩnh vực: <span>{formData.field}</span></p>
                        </div>
                    </div>
                    <div className="job-summary">
                        <p>Tên công việc:<input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} placeholder="Tên công việc" required /></p>
                        <p>Mức lương:<input type="text" name="salary" value={formData.salary} onChange={handleChange} placeholder="Mức lương" /></p>
                        <p>Kinh nghiệm:<input type="text" name="experience" value={formData.experience} onChange={handleChange} placeholder="Kinh nghiệm" /></p>
                        <select name="jobType" value={formData.jobType} onChange={handleChange} required>
                            <option value="">-- Chọn loại việc --</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Remote">Remote</option>
                        </select>
                    </div>
                </div>

                <div className="job-details">
                    <section>
                        <h3>Mô tả công việc</h3>
                        <textarea name="jobDescription" value={formData.jobDescription} onChange={handleChange} placeholder="Nhập mô tả công việc chi tiết" />
                    </section>
                    <section>
                        <h3>Yêu cầu công việc</h3>
                        <textarea name="jobRequirements" value={formData.jobRequirements} onChange={handleChange} placeholder="Nhập các yêu cầu cho công việc" />
                    </section>
                    <section>
                        <h3>Ngôn ngữ</h3>
                        <textarea name="languages" value={formData.languages.join(',')} onChange={(e) => handleArrayChange(e, 'languages')} placeholder="Nhập ngôn ngữ, cách nhau bởi dấu phẩy" />
                    </section>
                </div>

                <div className="job-footer">
                    <p>Số lượng tuyển:<input type="number" name="vacancies" value={formData.vacancies} onChange={handleChange} min="1" required /></p>
                    <p>Hạn cuối:<input type="date" name="deadline" value={formData.deadline} onChange={handleChange} required /></p>
                    <div className="profile-edit-actions">
                        <button onClick={handleSave} className="save-btn" disabled={isSubmitting}>{isSubmitting ? 'Đang lưu...' : 'Lưu'}</button>
                        <button onClick={() => navigate('/manageposts')} className="cancel-btn" disabled={isSubmitting}>Hủy</button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default EditJob;
