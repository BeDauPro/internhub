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

// ===== EMPLOYER ACCOUNT API =====

// Create Employer Account
export const createEmployerAccount = async(data) => {
    try {
        const response = await axiosInstance.post('/admin/EmployerAccount', data);
        return response.data;
    } catch (err) {
        throw handleError(err);
    }
};

// Get All Employers
export const getAllEmployers = async() => {
    try {
        const response = await axiosInstance.get('/admin/EmployerAccount');
        return response.data;
    } catch (err) {
        throw handleError(err);
    }
};

// Get Single Employer by ID
export const getEmployerById = async(id) => {
    try {
        const response = await axiosInstance.get(`/admin/EmployerAccount/${id}`);
        return response.data;
    } catch (err) {
        throw handleError(err);
    }
};

// Update Employer Account
export const updateEmployerAccount = async(id, data) => {
    try {
        const response = await axiosInstance.put(`/admin/EmployerAccount/${id}`, data);
        return response.data;
    } catch (err) {
        throw handleError(err);
    }
};

// Delete Employer Account
export const deleteEmployerAccount = async(id) => {
    try {
        const response = await axiosInstance.delete(`/admin/EmployerAccount/${id}`);
        return response.data;
    } catch (err) {
        throw handleError(err);
    }
};

// ===== EVENT API =====

// Get All Events
export const getAllEvents = async() => {
    try {
        const response = await axiosInstance.get('/admin/Event');
        return response.data;
    } catch (err) {
        throw handleError(err);
    }
};

// Get Event by ID
export const getEventById = async(id) => {
    try {
        const response = await axiosInstance.get(`/admin/Event/${id}`);
        return response.data;
    } catch (err) {
        throw handleError(err);
    }
};

// Create Event
export const createEvent = async(eventData) => {
    try {
        const response = await axiosInstance.post('/admin/Event', eventData);
        return response.data;
    } catch (err) {
        throw handleError(err);
    }
};

// Update Event
export const updateEvent = async(id, eventData) => {
    try {
        const response = await axiosInstance.put(`/admin/Event/${id}`, eventData);
        return response.data;
    } catch (err) {
        throw handleError(err);
    }
};

// Delete Event
export const deleteEvent = async(id) => {
    try {
        const response = await axiosInstance.delete(`/admin/Event/${id}`);
        return response.data;
    } catch (err) {
        throw handleError(err);
    }
};

// ===== JOB POSTING API =====

// Get Pending Job Postings
export const getPendingJobPostings = async() => {
    try {
        const response = await axiosInstance.get('/Admin/JobPosting/Pending');
        return response.data;
    } catch (err) {
        throw handleError(err);
    }
};

// Approve Job Posting
export const approveJobPosting = async(id) => {
    try {
        const response = await axiosInstance.patch(`/Admin/JobPosting/${id}/Approve`);
        return response.data;
    } catch (err) {
        throw handleError(err);
    }
};

// Reject Job Posting
export const rejectJobPosting = async(id) => {
    try {
        const response = await axiosInstance.patch(`/Admin/JobPosting/${id}/Reject`);
        return response.data;
    } catch (err) {
        throw handleError(err);
    }
};

// Get All Accepted Job Postings
export const getAllAcceptedJobPostings = async(category, location, workType) => {
    try {
        let url = '/JobPosting';
        const params = new URLSearchParams();

        if (category) params.append('category', category);
        if (location) params.append('location', location);
        if (workType) params.append('workType', workType);

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        const response = await axiosInstance.get(url);
        return response.data;
    } catch (err) {
        throw handleError(err);
    }
};

// Get Job Posting Details
export const getJobPostingById = async(id) => {
    try {
        const response = await axiosInstance.get(`/JobPosting/${id}`);
        return response.data;
    } catch (err) {
        throw handleError(err);
    }
};

// Get Filtered Job Postings
export const getFilteredJobPostings = async(
    searchTerm,
    workType,
    location,
    jobCategory,
    sortDirection = 'desc',
    pageNumber = 1,
    pageSize = 8
) => {
    try {
        const params = new URLSearchParams();

        if (searchTerm) params.append('searchTerm', searchTerm);
        if (workType) params.append('workType', workType);
        if (location) params.append('location', location);
        if (jobCategory) params.append('jobCategory', jobCategory);
        params.append('sortDirection', sortDirection);
        params.append('pageNumber', pageNumber);
        params.append('pageSize', pageSize);

        const response = await axiosInstance.get(`/JobPosting/filtered?${params.toString()}`);
        return response.data;
    } catch (err) {
        throw handleError(err);
    }
};

// Group APIs for convenience
export const employerAPI = {
    createEmployerAccount,
    getAllEmployers,
    getEmployerById,
    updateEmployerAccount,
    deleteEmployerAccount
};

export const eventAPI = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
};

export const jobPostingAPI = {
    getPendingJobPostings,
    approveJobPosting,
    rejectJobPosting,
    getAllAcceptedJobPostings,
    getJobPostingById,
    getFilteredJobPostings
};

// Default export with all APIs
export default {
    employer: employerAPI,
    event: eventAPI,
    jobPosting: jobPostingAPI
};