import axios from 'axios';

const BASE_URL = 'https://localhost:7286/api';

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

// ===== EVENT API FOR STUDENTS =====

// Get All Events
export const getAllStudentEvents = async() => {
    try {
        const response = await axiosInstance.get('/student/events');
        return response.data;
    } catch (err) {
        throw handleError(err);
    }
};

// Get Event by ID
export const getStudentEventById = async(id) => {
    try {
        const response = await axiosInstance.get(`/student/events/${id}`);
        return response.data;
    } catch (err) {
        throw handleError(err);
    }
};

// Export event API functions
export const studentEventAPI = {
    getAllEvents: getAllStudentEvents,
    getEventById: getStudentEventById
};

export default {
    events: studentEventAPI
};