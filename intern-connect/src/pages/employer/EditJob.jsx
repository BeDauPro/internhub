import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import logo from '../../images/fpt.jpg';
import { PiCertificate } from "react-icons/pi";
import { FaLocationDot, FaMoneyBill1 } from "react-icons/fa6";
import { MdHomeRepairService } from "react-icons/md";
import { FaUsers, FaCalendarAlt } from "react-icons/fa";
import '../../styles/pages/employer/editjob.scss';
import NavbarEmployer from '../../components/employer/NavbarEmployer';
import Footer from '../../components/Footer';
const EditJob = ({ editJob, onSave }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState(editJob);

    useEffect(() => {
        setFormData(editJob);
    }, [editJob]);

    useEffect(() => {
        if (location.state?.clearForm) {
            setFormData({
                companyName: "",
                location: "",
                field: "",
                jobTitle: "",
                jobType: "",
                salary: "",
                experience: "",
                jobDescription: "",
                jobRequirements: "",
                languages: [],
                vacancies: 0,
                deadline: "",
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


    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setFormData({ ...formData, logo: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };
    const handleSave = () => {
        console.log("Updated Data:", formData);
        onSave(formData);
        navigate("/manageposts", { state: { updatedJob: { 
            id: formData.id || Date.now(), // Generate ID if not present
            title: formData.jobTitle,
            type: formData.jobType,
            typeClass: formData.jobType.toLowerCase().replace(" ", "-"),
            company: formData.companyName,
            location: formData.location,
            quantity: formData.vacancies,
            logo: formData.logo
        } } });
    };

    return (
        <>
        <NavbarEmployer/>
        <div className="job-detail-container">
            <div className="job-header">
                <div className="company-info">
                    <div className="upload-logo">
                        <img className="company-logo" src={formData.logo || logo} alt="Company Logo" />
                        <input type="file" accept="image/*" onChange={handleImageUpload} />
                    </div>
                    <div className="company-details">
                        <p>Tên công ty:<input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Tên công ty" /></p>
                        <p>Địa chỉ:<input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Địa chỉ" /></p>
                        <p className="job-field">Lĩnh vực:<input type="text" name="field" value={formData.field} onChange={handleChange} placeholder="Lĩnh vực" /></p>
                    </div>
                </div>
                <div className="job-summary">
                    <p>Tên công việc:<input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} placeholder="Tên công việc" /></p>
                    <p>Mức lương:<input type="text" name="salary" value={formData.salary} onChange={handleChange} placeholder="Mức lương" /></p>
                    <p>Kinh nghiệm:<input type="text" name="experience" value={formData.experience} onChange={handleChange} placeholder="Kinh nghiệm" /></p>
                    <select name="jobType" value={formData.jobType} onChange={handleChange} placeholder="Loại việc">
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Remote</option>
                    </select>
                </div>
            </div>

            <div className="job-details">
                <section>
                    <h3>Mô tả công việc</h3>
                    <textarea name="jobDescription" value={formData.jobDescription} onChange={handleChange} />


                </section>
                <section>
                    <h3>Yêu cầu công việc</h3>
                    <textarea name="jobRequirements" value={formData.jobRequirements} onChange={handleChange} />
                </section>
                <section>
                    <h3>Ngôn ngữ</h3>
                    <textarea
                        name="languages"
                        value={formData.languages.join(",")}
                        onChange={(e) => handleArrayChange(e, "languages")}
                        placeholder="Nhập ngôn ngữ cần có"
                    />
                </section>
            </div>

            <div className="job-footer">
                <p>Số lượng tuyển:<input type="text" name="vacancies" value={formData.vacancies} onChange={handleChange} placeholder="Số lượng tuyển" /></p>
                <p>Hạn cuối:<input type="date" name="deadline" value={formData.deadline} onChange={handleChange} /></p>
                <div className="profile-edit-actions">
                    <button onClick={handleSave} className="save-btn">Lưu</button>
                    <button onClick={() => navigate("/jobdetail")} className="cancel-btn">Hủy</button>
                </div>
            </div>
        </div>
        <Footer/>
        </>
    )
}

export default EditJob
