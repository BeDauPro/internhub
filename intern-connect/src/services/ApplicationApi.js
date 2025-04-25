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

// Apply for a job (for students)
export const applyForJob = async(applicationData) => {
    try {
        const response = await axiosInstance.post('/applications/apply', applicationData);
        return response.data;
    } catch (err) {
        throw handleError(err);
    }
};

// Get applications by job posting ID (for employers)
export const getApplicationsByJobPosting = async(jobPostingId) => {
    try {
        const response = await axiosInstance.get(`/applications/job/${jobPostingId}`);
        return response.data;
    } catch (err) {
        throw handleError(err);
    }
};

// Get application history for the logged-in student
export const getStudentApplicationHistory = async() => {
    try {
        const response = await axiosInstance.get('/applications/student/history');
        return response.data;
    } catch (err) {
        throw handleError(err);
    }
};

// Update application status (for employers)
// export const updateApplicationStatus = async(applicationId, newStatus) => {
//     try {
//         const response = await axiosInstance.put(`/applications/application/${applicationId}/status`, newStatus);
//         return response.data;
//     } catch (err) {
//         throw handleError(err);
//     }
// };

export const updateApplicationStatus = async (applicationId, status) => {
    try {
      const response = await axiosInstance.put(
        `/applications/${applicationId}/status`,
        status  // Send just the status value, not wrapped in object
      );
      return response.data;
    } catch (err) {
      throw handleError(err);
    }
  };


// Get all students (for admin)
export const getAllStudentsForAdmin = async() => {
    try {
        const response = await axiosInstance.get('/applications/admin/all');
        return response.data;
    } catch (err) {
        throw handleError(err);
    }
};

// Get candidates for employer
export const getCandidatesForEmployer = async() => {
    try {
        const response = await axiosInstance.get('/applications/employer/candidates');
        return response.data;
    } catch (err) {
        throw handleError(err);
    }
};

// Group APIs for convenience
export const applicationAPI = {
    applyForJob,
    getApplicationsByJobPosting,
    getStudentApplicationHistory,
    updateApplicationStatus,
    getAllStudentsForAdmin,
    getCandidatesForEmployer
};

// Default export with all APIs
export default applicationAPI;