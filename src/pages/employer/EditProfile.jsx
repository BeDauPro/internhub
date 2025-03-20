import { React, useEffect, useState } from 'react'
import { AiOutlineMail, AiOutlineHome, AiOutlinePhone, AiOutlineGroup, AiOutlineGlobal, AiOutlineFieldTime } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/employer/editprofile.scss';
import logo from '../../images/fpt.jpg';

const EditProfile = ({ initialData, onSave }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(initialData);

    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);
    
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
        navigate("/employerprofile");
    };
    return (
        <div className="profile-edit-container">
            <div className="profile-card">
                <img className="profile-image" src={formData.logo || logo} alt="avatar" />
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                <h2><input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Tên công ty" /></h2>
                <h3>Thông tin liên hệ</h3>
                <p><AiOutlineMail />  <input type="email" name="companyEmail" value={formData.companyEmail} onChange={handleChange} placeholder="Email" /></p>
                <p><AiOutlineHome /> <input type="text" name="addresscom" value={formData.addresscom} onChange={handleChange} placeholder="Địa chỉ" /></p>
                <p><AiOutlinePhone /> <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Số điện thoại" /></p>
                <p><AiOutlineGroup /><input type="text" name="totalemployee" value={formData.totalEmployee} onChange={handleChange} placeholder="Tổng số nhân viên" /></p>
                <p><AiOutlineGlobal /> <a href={formData.website} target="_blank" rel="noopener noreferrer"></a><input type="text" name="website" value={formData.website} onChange={handleChange} placeholder="website công ty" /></p>
                <p><AiOutlineFieldTime /> <input type="date" name="since" value={formData.since} onChange={handleChange} /></p>
            </div>
            <div className="profile-details">
                <section className="section">
                    <h3>Giới thiệu công ty</h3>
                    <textarea name="introduction" value={formData.introduction} onChange={handleChange} />
                </section>

                <section className="section">
                    <h3>Dịch vụ cung cấp</h3>
                    <textarea
                        name="services"
                        value={formData.services.join(", ")}
                        onChange={(e) => handleArrayChange(e, "services")}
                        placeholder="Nhập các ngành nghề, cách nhau bằng dấu phẩy"
                    />
                </section>
                <div className="profile-edit-actions">
                    <button onClick={handleSave} className="save-btn">Lưu</button>
                    <button onClick={() => navigate("/employerprofile")} className="cancel-btn">Hủy</button>
                </div>
            </div>
        </div>
    )
}

export default EditProfile
