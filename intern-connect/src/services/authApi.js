// src/api/authApi.js
import axios from 'axios';

const BASE_URL = 'https://localhost:7286/api/Auth';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  });
  
export const registerUser = async (data) => {
  try {
    const response = await axiosInstance.post('/register-user', data);
    return response.data;
  } catch (err) {
    throw handleError(err);
  }
};

export const loginUser = async (data) => {
  try {
    const response = await axiosInstance.post('/login-user', data);
    return response;
  } catch (err) {
    throw handleError(err);
  }
};

export const sendForgotPassword = async (email) => {
  try {
    const response = await axiosInstance.get(`/forgot-password?email=${email}`);
    return response;
  } catch (err) {
    throw handleError(err);
  }
};

export const resetPassword = async (data) => {
  try {
    const response = await axiosInstance.post('/reset-password', data);
    return response;
  } catch (err) {
    throw handleError(err);
  }
};

export const verifyEmail = async (token) => {
  try {
    const response = await axiosInstance.get(`/verify-email?token=${token}`);
    return response.data;
  } catch (err) {
    throw handleError(err);
  }
};

// Hàm xử lý lỗi để tái sử dụng
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
