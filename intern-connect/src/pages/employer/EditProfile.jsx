import React, { useState, useEffect } from "react";
import "../../styles/pages/employer/editprofile.scss";
import { useNavigate } from "react-router-dom";
import { AiOutlineMail, AiOutlineHome, AiOutlinePhone, AiOutlineGroup, AiOutlineGlobal, AiOutlineFieldTime } from "react-icons/ai";
import Footer from "../../components/Footer";
import { getEmployerProfile, updateEmployer, createEmployer, deleteEmployer } from "../../services/employerApi";
import defaultAvatar from "../../images/defaultAvatar.jpg";
const EditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await getEmployerProfile();
        setFormData(data || {});
      } catch (error) {
        console.error("Error fetching employer profile:", error);
        alert("Không thể tải dữ liệu nhà tuyển dụng.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, companyLogo: file });
  };

  const handleCreate = async () => {
    try {
      await createEmployer(formData);
      alert("Tạo thông tin nhà tuyển dụng thành công!");
      navigate("/employerprofile");
    } catch (error) {
      console.error("Error creating employer profile:", error);
      alert("Không thể tạo thông tin nhà tuyển dụng.");
    }
  };

  const handleUpdate = async () => {
    try {
      await updateEmployer(formData.employerId, formData);
      alert("Cập nhật thông tin nhà tuyển dụng thành công!");
      navigate("/employerprofile");
    } catch (error) {
      console.error("Error updating employer profile:", error);
      alert("Không thể cập nhật thông tin nhà tuyển dụng.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc muốn xoá thông tin nhà tuyển dụng này?")) return;
    try {
      await deleteEmployer(formData.employerId);
      alert("Xoá thông tin nhà tuyển dụng thành công!");
      navigate("/employerprofile");
    } catch (error) {
      console.error("Error deleting employer profile:", error);
      alert("Không thể xoá thông tin nhà tuyển dụng.");
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <>
      <div className="profile-edit-container">
        <div className="profile-edit-wrapper">
          <div className="profile-edit-card">
            <img
              className="profile-edit-image"
              src={
                formData.companyLogo instanceof File
                  ? URL.createObjectURL(formData.companyLogo) 
                  : formData.companyLogo || defaultAvatar 
              }
              alt="Logo"
            />
            <section className="logo-upload">
              <h3>Logo công ty</h3>
              <input
                type="file"
                name="companyLogo"
                onChange={handleImageUpload}
                accept="image/*"
              />
            </section>
            <h2>
              <input
                type="text"
                name="companyName"
                value={formData.companyName || ""}
                onChange={handleChange}
                placeholder="Tên công ty"
              />
            </h2>
            <section className="contact-section">
              <h3>Thông tin liên hệ</h3>
              <p>
                <AiOutlineMail />{" "}
                <input
                  type="email"
                  name="companyEmail"
                  value={formData.companyEmail || ""}
                  onChange={handleChange}
                  placeholder="Email"
                />
              </p>
              <p>
                <AiOutlineHome />{" "}
                <input
                  type="text"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                  placeholder="Địa chỉ"
                />
              </p>
              <p>
                <AiOutlinePhone />{" "}
                <input
                  type="text"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  placeholder="Số điện thoại"
                />
              </p>
              <p>
                <AiOutlineGroup />{" "}
                <input
                  type="text"
                  name="employeeSize"
                  value={formData.employeeSize || ""}
                  onChange={handleChange}
                  placeholder="Tổng số nhân viên"
                />
              </p>
              <p>
                <AiOutlineGlobal />{" "}
                <input
                  type="text"
                  name="website"
                  value={formData.website || ""}
                  onChange={handleChange}
                  placeholder="Website công ty"
                />
              </p>
              <p>
                <AiOutlineFieldTime />{" "}
                <input
                  type="number"
                  name="foundedYear"
                  value={formData.foundedYear || ""}
                  onChange={handleChange}
                  placeholder="Năm thành lập"
                />
              </p>
            </section>
          </div>

          <div className="profile-edit-details">
            <section>
              <h3>Giới thiệu công ty</h3>
              <textarea
                name="companyDescription"
                value={formData.companyDescription || ""}
                onChange={handleChange}
                placeholder="Nhập giới thiệu công ty"
              />
            </section>

            <section>
              <h3>Ngành nghề</h3>
              <input
                type="text"
                name="industry"
                value={formData.industry || ""}
                onChange={handleChange}
                placeholder="Nhập ngành nghề"
              />
            </section>

            <div className="profile-edit-actions">
              {!formData.employerId ? (
                <button onClick={handleCreate} className="save-btn">
                  Lưu (Tạo mới)
                </button>
              ) : (
                <>
                  <button onClick={handleUpdate} className="save-btn">
                    Cập nhật
                  </button>
                  <button onClick={handleDelete} className="delete-btn">
                    Xoá
                  </button>
                </>
              )}
              <button onClick={() => navigate("/employerprofile")} className="cancel-btn">
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EditProfile;
