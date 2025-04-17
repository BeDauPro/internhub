import axios from 'axios';

const BASE_URL = 'https://localhost:7286/api/admin/EmployerAccount';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Interceptor to add authorization token
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// Helper function to handle errors consistently
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

// Create Employer Account
export const createEmployerAccount = async(data) => {
    try {
        const response = await axiosInstance.post('', data);
        return response.data;
    } catch (err) {
        throw handleError(err);
    }
};

// Get All Employers
export const getAllEmployers = async() => {
    try {
        const response = await axiosInstance.get('');
        return response.data;
    } catch (err) {
        throw handleError(err);
    }
};

// Get Single Employer by ID
export const getEmployerById = async(id) => {
    try {
        const response = await axiosInstance.get(`/${id}`);
        return response.data;
    } catch (err) {
        throw handleError(err);
    }
};

// Update Employer Account
export const updateEmployerAccount = async(id, data) => {
    try {
        const response = await axiosInstance.put(`/${id}`, data);
        return response.data;
    } catch (err) {
        throw handleError(err);
    }
};

// Delete Employer Account
export const deleteEmployerAccount = async(id) => {
    try {
        const response = await axiosInstance.delete(`/${id}`);
        return response.data;
    } catch (err) {
        throw handleError(err);
    }
};

export default {
    createEmployerAccount,
    getAllEmployers,
    getEmployerById,
    updateEmployerAccount,
    deleteEmployerAccount,
};