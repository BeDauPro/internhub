import axios from 'axios';

const BASE_URL = 'https://localhost:7286/api/EmployerProfile';

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

// Lấy danh sách employer (chỉ dành cho admin)
export const getPagedEmployers = async ({
  companyName,
  address,
  sortBy = 'companyName',
  sortDirection = 'asc',
  pageNumber = 1,
  pageSize = 10,
}) => {
  const params = {
    companyName,
    address,
    sortBy,
    sortDirection,
    pageNumber,
    pageSize,
  };

  const response = await axiosInstance.get('/admin/paged', { params });
  return response.data;
};

// Lọc danh sách employer (dành cho student)
export const filterEmployers = async ({
  companyName,
  address,
  sortBy = 'CompanyName',
  sortDirection = 'asc',
  pageNumber = 1,
  pageSize = 10,
}) => {
  const params = {
    companyName,
    address,
    sortBy,
    sortDirection,
    pageNumber,
    pageSize,
  };

  const response = await axiosInstance.get('/filter', { params });
  return response.data;
};

// Lấy thông tin employer hiện tại (dành cho employer đã đăng nhập)
export const getEmployerProfile = async () => {
  try {
    const response = await axiosInstance.get('/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching employer profile:', error);
    throw error;
  }
};

// Tạo employer profile (dành cho employer đã đăng nhập)
export const createEmployer = async (formData) => {
  const response = await axiosInstance.post('/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Cập nhật employer profile
export const updateEmployer = async (id, formData) => {
  const response = await axiosInstance.put(`/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Xoá employer profile
export const deleteEmployer = async (id) => {
  const response = await axiosInstance.delete(`/${id}`);
  return response.status === 204;
};
