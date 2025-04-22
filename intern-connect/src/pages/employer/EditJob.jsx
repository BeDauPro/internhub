import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { PiCertificate } from "react-icons/pi";
import { FaLocationDot, FaMoneyBill1 } from "react-icons/fa6";
import { MdHomeRepairService } from "react-icons/md";
import { FaUsers, FaCalendarAlt } from "react-icons/fa";
import axios from 'axios';
import '../../styles/pages/employer/editjob.scss';
import Footer from '../../components/Footer';
import { getJobById, createJob, updateJob, deleteJob } from '../../services/JobPostingApi';

const EditJob = ({ editJob, onSave }) => {
    const navigate = useNavigate();
    const address = useLocation();
    const { id } = useParams(); // Lấy id từ URL nếu đang edit job
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState(editJob || {
        // Các trường mặc định sẽ được tự động import sau này
        companyName: "",
        address: "",
        industry: "", 
        
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

    // Xác định mode: edit hoặc create
    const isEditMode = !!id;

    useEffect(() => {
        if (editJob) {
            setFormData(editJob);
        }
    }, [editJob]);

    // Fetch job data nếu đang edit và không có dữ liệu
    useEffect(() => {
        const fetchJobData = async () => {
            if (id) {
                try {
                    setIsLoading(true);
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`https://localhost:7286/api/JobPosting/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    
                    const jobData = response.data;
                    
                    // Chuyển đổi dữ liệu từ API sang form format
                    setFormData({
                        companyName: jobData.companyName,
                        address: jobData.address,
                        industry: jobData.jobCategory,
                        jobTitle: jobData.jobTitle,
                        jobType: jobData.workType,
                        salary: jobData.salary,
                        experience: jobData.experienceRequired,
                        jobDescription: jobData.jobDesc,
                        jobRequirements: jobData.skillsRequired,
                        languages: jobData.languagesRequired ? jobData.languagesRequired.split(',') : [],
                        vacancies: jobData.vacancies,
                        deadline: new Date(jobData.applicationDeadline).toISOString().split('T')[0]
                    });
                } catch (err) {
                    console.error("Error fetching job data:", err);
                    setError("Không thể tải thông tin công việc. Vui lòng thử lại sau.");
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchJobData();
    }, [id]);

    useEffect(() => {
        if (address.state?.clearForm) {
            setFormData({
                companyName: "",
                address: "",
                industry: "",
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
    }, [address.state]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleArrayChange = (e, industry) => {
        const value = e.target.value.split(',').map(item => item.trim());
        setFormData({ ...formData, [industry]: value });
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
            if (formData.industry) formDataToSend.append('JobCategory', formData.industry);
            if (formData.address) formDataToSend.append('address', formData.address);
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
                        address: result.address || formData.address,
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

    // Thêm hàm xử lý xóa job
    const handleDelete = async () => {
        if (window.confirm("Bạn có chắc chắn muốn xóa công việc này?")) {
            try {
                setIsSubmitting(true);
                const token = localStorage.getItem('token');
                await axios.delete(`https://localhost:7286/api/Employer/JobPosting/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                alert("Đã xóa công việc thành công!");
                navigate("/manageposts");
            } catch (err) {
                console.error("Error deleting job:", err);
                setError("Không thể xóa công việc. Vui lòng thử lại sau.");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    if (isLoading) {
        return <div className="loading-container">Đang tải dữ liệu...</div>;
    }

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
                        <p>Địa chỉ: <span>{formData.address}</span></p>
                        <p className="job-industry">Lĩnh vực: <span>{formData.industry}</span></p>
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
                        {isSubmitting ? 'Đang lưu...' : (isEditMode ? 'Cập nhật' : 'Tạo mới')}
                    </button>
                    {id && ( // Chỉ hiển thị nút Xóa khi đang edit job hiện có
                        <button 
                            onClick={handleDelete} 
                            className="delete-btn"
                            disabled={isSubmitting}
                        >
                            Xóa
                        </button>
                    )}
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
    );
};

export default EditJob;
