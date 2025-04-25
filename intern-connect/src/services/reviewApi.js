import axios from 'axios';

const BASE_URL = 'https://localhost:7286/api'; 

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Gắn token vào tất cả request nếu có
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  } else {
    console.warn('Authentication token is missing.');
  }
  return config;
});


// Tạo đánh giá
export const createReview = async (reviewDto) => {
    try {
      const response = await axiosInstance.post('/StudentReview', reviewDto);
      return response.data;
    } catch (err) {
      throw handleError(err);
    }
  };
  
  // Lấy danh sách đánh giá cho sinh viên
  export const getReviewsForStudent = async (studentId) => {
    try {
      const response = await axiosInstance.get(`/StudentReview/student/${studentId}`);
      return response.data;
    } catch (err) {
      throw handleError(err);
    }
  };
  
  // Lấy danh sách đánh giá cho nhà tuyển dụng
  export const getReviewsForEmployer = async (employerId) => {
    try {
      const response = await axiosInstance.get(`/StudentReview/employer/${employerId}`);
      return response.data;
    } catch (err) {
      throw handleError(err);
    }
  };

const handleError = (err) => {
  if (err.response && err.response.data) {
    return {
      status: err.response.status,
      data: err.response.data,
    };
  }
  return {
    status: 500,
    data: { message: 'Unknown error occurred' },
  };
};
