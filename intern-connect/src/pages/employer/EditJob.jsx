import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { PiCertificate } from "react-icons/pi";
import { FaLocationDot, FaMoneyBill1 } from "react-icons/fa6";
import { MdHomeRepairService } from "react-icons/md";
import { FaUsers, FaCalendarAlt } from "react-icons/fa";
import axios from 'axios';
import '../../styles/pages/employer/editjob.scss';
import Footer from '../../components/Footer';

const EditJob = ({ editJob, onSave }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams(); // Lấy id từ URL nếu đang edit job
    const [formData, setFormData] = useState(editJob || {
        // Các trường mặc định sẽ được tự động import sau này
        companyName: "",
        location: "",
        field: "", 
        
        // Các trường người dùng cần nhập
        jobTitle: "",
        jobType: "Full-time",
        salary: "",
        experience: "",
        jobDescription: "",
        jobRequirements: "",
        languages: [],
        vacancies: 1,
        deadline: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (editJob) {
            setFormData(editJob);
        }
    }, [editJob]);

    // Fetch job data nếu đang edit và không có dữ liệu
    useEffect(() => {
        const fetchJobData = async () => {
            if (id && !editJob) {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`https://localhost:7286/api/JobPosting/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    
                    const jobData = response.data;
                    
                    // Chuyển đổi dữ liệu từ API sang form format
                    setFormData({
                        companyName: jobData.CompanyName,
                        location: jobData.Location,
                        field: jobData.JobCategory,
                        jobTitle: jobData.JobTitle,
                        jobType: jobData.WorkType,
                        salary: jobData.Salary,
                        experience: jobData.ExperienceRequired,
                        jobDescription: jobData.JobDesc,
                        jobRequirements: jobData.SkillsRequired,
                        languages: jobData.LanguagesRequired ? jobData.LanguagesRequired.split(',') : [],
                        vacancies: jobData.Vacancies,
                        deadline: new Date(jobData.ApplicationDeadline).toISOString().split('T')[0]
                    });
                } catch (err) {
                    console.error("Error fetching job data:", err);
                    setError("Không thể tải thông tin công việc. Vui lòng thử lại sau.");
                }
            }
        };

        fetchJobData();
    }, [id, editJob]);

    useEffect(() => {
        if (location.state?.clearForm) {
            setFormData({
                companyName: "",
                location: "",
                field: "",
                jobTitle: "",
                jobType: "Full-time",
                salary: "",
                experience: "",
                jobDescription: "",
                jobRequirements: "",
                languages: [],
                vacancies: 1,
                deadline: ""
            });
        }
    }, [location.state]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleArrayChange = (e, field) => {
        const value = e.target.value.split(",").map((item) => item.trim());
        setFormData({ ...formData, [field]: value });
    };

    const validateForm = () => {
        // Kiểm tra các trường bắt buộc
        if (!formData.jobTitle || formData.jobTitle.trim() === '') {
            setError("Tiêu đề công việc là bắt buộc");
            return false;
        }
        
        if (!formData.jobType || formData.jobType.trim() === '') {
            setError("Loại công việc là bắt buộc");
            return false;
        }
        
        if (!formData.deadline) {
            setError("Thời hạn nộp hồ sơ là bắt buộc");
            return false;
        }
        
        // Kiểm tra deadline trong tương lai
        const deadlineDate = new Date(formData.deadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (deadlineDate <= today) {
            setError("Thời hạn nộp hồ sơ phải là ngày trong tương lai");
            return false;
        }
        
        return true;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }
        
        setIsSubmitting(true);
        setError(null);
        
        try {
            // Tạo FormData để gửi dữ liệu
            const formDataToSend = new FormData();
            
            // Thêm các trường bắt buộc
            formDataToSend.append('JobTitle', formData.jobTitle);
            formDataToSend.append('WorkType', formData.jobType);
            
            // Xử lý ngày tháng - đảm bảo định dạng đúng
            const deadlineDate = new Date(formData.deadline);
            formDataToSend.append('ApplicationDeadline', deadlineDate.toISOString());
            
            // Thêm các trường không bắt buộc nếu có
            if (formData.jobDescription) formDataToSend.append('JobDesc', formData.jobDescription);
            if (formData.jobRequirements) formDataToSend.append('SkillsRequired', formData.jobRequirements);
            if (formData.salary) formDataToSend.append('Salary', formData.salary);
            if (formData.experience) formDataToSend.append('ExperienceRequired', formData.experience);
            if (formData.field) formDataToSend.append('JobCategory', formData.field);
            if (formData.location) formDataToSend.append('Location', formData.location);
            if (formData.vacancies) formDataToSend.append('Vacancies', formData.vacancies);
            
            // Xử lý languages - chuyển array thành string
            if (formData.languages && Array.isArray(formData.languages) && formData.languages.length > 0) {
                formDataToSend.append('LanguagesRequired', formData.languages.join(','));
            }
            
            // Log để debug
            console.log("Dữ liệu gửi đi:", Object.fromEntries(formDataToSend));
            
            const token = localStorage.getItem('token');
            let response;
            
            if (id) {
                // Cập nhật job posting
                response = await axios.put(`https://localhost:7286/api/Employer/JobPosting/${id}`, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log("Job updated successfully:", response.data);
            } else {
                // Tạo mới job posting
                response = await axios.post('https://localhost:7286/api/Employer/JobPosting', formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log("Job created successfully:", response.data);
            }
            
            const result = response.data;
            
            // Gọi callback onSave nếu có
            if (onSave) {
                onSave(result);
            }
            
            // Chuyển hướng về trang quản lý bài đăng
            navigate("/manageposts", { 
                state: { 
                    updatedJob: { 
                        id: result.JobPostingId || Date.now(),
                        title: result.JobTitle || formData.jobTitle,
                        type: result.WorkType || formData.jobType,
                        typeClass: (result.WorkType || formData.jobType).toLowerCase().replace(" ", "-"),
                        company: result.CompanyName || formData.companyName,
                        location: result.Location || formData.location,
                        quantity: result.Vacancies || formData.vacancies
                    } 
                } 
            });
        } catch (err) {
            console.error("Error full details:", err);
            if (err.response) {
                console.error("Response data:", err.response.data);
                console.error("Response status:", err.response.status);
                
                if (err.response.data && err.response.data.error) {
                    setError(err.response.data.error);
                } else if (err.response.data && typeof err.response.data === 'object') {
                    // Model validation errors
                    const errors = Object.values(err.response.data).flat();
                    setError(errors.join(', '));
                } else {
                    setError("Có lỗi xảy ra khi lưu bài đăng. Vui lòng thử lại sau.");
                }
            } else {
                setError("Có lỗi xảy ra khi kết nối đến server. Vui lòng thử lại sau.");
            }
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
                    <textarea 
                        name="jobDescription" 
                        value={formData.jobDescription} 
                        onChange={handleChange}
                        placeholder="Nhập mô tả công việc chi tiết" 
                    />
                </section>
                <section>
                    <h3>Yêu cầu công việc</h3>
                    <textarea 
                        name="jobRequirements" 
                        value={formData.jobRequirements} 
                        onChange={handleChange}
                        placeholder="Nhập các yêu cầu cho công việc" 
                    />
                </section>
                <section>
                    <h3>Ngôn ngữ</h3>
                    <textarea
                        name="languages"
                        value={formData.languages?.join(",") || ""}
                        onChange={(e) => handleArrayChange(e, "languages")}
                        placeholder="Nhập ngôn ngữ cần có, phân cách bằng dấu phẩy"
                    />
                </section>
            </div>

            <div className="job-footer">
                <p>Số lượng tuyển:
                    <input 
                        type="number" 
                        name="vacancies" 
                        value={formData.vacancies} 
                        onChange={handleChange} 
                        placeholder="Số lượng tuyển"
                        min="1"
                        required
                    />
                </p>
                <p>Hạn cuối:
                    <input 
                        type="date" 
                        name="deadline" 
                        value={formData.deadline} 
                        onChange={handleChange}
                        required
                    />
                </p>
                <div className="profile-edit-actions">
                    <button 
                        onClick={handleSave} 
                        className="save-btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Đang lưu...' : 'Lưu'}
                    </button>
                    <button 
                        onClick={() => navigate("/manageposts")} 
                        className="cancel-btn"
                        disabled={isSubmitting}
                    >
                        Hủy
                    </button>
                </div>
            </div>
        </div>
        <Footer/>
        </>
    )
}

export default EditJob