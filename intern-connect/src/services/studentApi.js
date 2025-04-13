import axios from 'axios';

const BASE_URL = 'https://localhost:7286/api/Students';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Gắn token vào header nếu có
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  } else {
    console.error('Authentication token is missing.');
  }
  return config;
});

// Lấy tất cả sinh viên
export const getAllStudents = async () => {
  const response = await axiosInstance.get('/');
  return response.data;
};

// Lấy thông tin sinh viên hiện tại (theo token)
export const getStudentProfile = async () => {
  try {
    const response = await axiosInstance.get('/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching student profile:', error);
    throw error;
  }
};

// Export getStudentProfile as fetchStudentProfile for compatibility
export { getStudentProfile as fetchStudentProfile };

// Tạo sinh viên mới
export const createStudent = async (formData) => {
  const response = await axiosInstance.post('/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Cập nhật sinh viên
export const updateStudent = async (id, formData) => {
  const response = await axiosInstance.put(`/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Xóa sinh viên
export const deleteStudent = async (id) => {
  const response = await axiosInstance.delete(`/${id}`);
  return response.status === 204;
};

// Lấy danh sách trạng thái sinh viên (nếu backend là "statuses")
export const getStudentStatuses = async () => {
  const response = await axiosInstance.get('/statuses');
  return response.data;
};

// Lấy danh sách sinh viên phân trang, lọc, sắp xếp
export const getPagedStudents = async ({
  fullName,
  schoolEmail,
  status,
  sortBy = 'FullName',
  sortDirection = 'asc',
  pageNumber = 1,
  pageSize = 10,
}) => {
  const params = {
    fullName,
    schoolEmail,
    status,
    sortBy,
    sortDirection,
    pageNumber,
    pageSize,
  };

  const response = await axiosInstance.get('/admin/paged', { params });
  return response.data;
};
