import React from 'react'
import Button from '../components/Button';

const EmployerDashboard = () => {
    const handleSave = () => {
        alert('Save button clicked');
    };
    const handleEdit = () => {
        alert('Edit button clicked');
    };
  return (
    <div>
      <h2>Chỉnh sửa Hồ sơ</h2>
      <input type="text" placeholder="Họ và tên" />
      <input type="email" placeholder="Email" />
      <Button  text="Edit" onClick={handleEdit} variant="secondary"/>
      <Button text="Lưu" onClick={handleSave} variant="primary"/>
    </div>
  )
}

export default EmployerDashboard
