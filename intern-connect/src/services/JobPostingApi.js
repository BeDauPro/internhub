import axios from 'axios';

const BASE_URL = 'https://localhost:7286/api'; // Đảm bảo URL này khớp với backend của bạn

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Interceptor để tự động thêm token vào header
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// API endpoints cho public (không cần đăng nhập)
export const getAllJobs = async(category, location, workType) => {
    try {
        let url = '/JobPosting';
        const params = {};

        if (category) params.category = category;
        if (location) params.location = location;
        if (workType) params.workType = workType;

        const response = await axiosInstance.get(url, { params });
        return response.data;
    } catch (err) {
        throw handleError(err);
    }
};

export const getJobById = async(id) => {
    try {
        const response = await axiosInstance.get(`/JobPosting/${id}`);
        return response.data;
    } catch (err) {
        throw handleError(err);
    }
};

export const getFilteredJobs = async(searchTerm, workType, location, jobCategory, sortDirection = 'desc', pageNumber = 1, pageSize = 8) => {
    try {
        const params = {
            searchTerm,
            workType,
            location,
            jobCategory,
            sortDirection,
            pageNumber,
            pageSize
        };

        const response = await axiosInstance.get('/JobPosting/filtered', { params });
        return response.data;
    } catch (err) {
        throw handleError(err);
    }
};

// API endpoints cho Employer (cần đăng nhập với role Employer)
export const getEmployerJobs = async() => {
    try {
        const response = await axiosInstance.get('/Employer/JobPosting');
        return response.data;
    } catch (err) {
        throw handleError(err);
    }
};

export const createJob = async(jobData) => {
    try {
        // Tạo FormData để gửi dữ liệu
        const formData = new FormData();

        // Chuyển đổi dữ liệu từ cấu trúc EditJob sang cấu trúc API
        // Sử dụng tên trường đúng theo CreateJobPostingDto
        formData.append('JobTitle', jobData.jobTitle);
        formData.append('JobDesc', jobData.jobDescription);
        formData.append('SkillsRequired', jobData.jobRequirements);
        formData.append('Salary', jobData.salary);
        formData.append('ExperienceRequired', jobData.experience);
        formData.append('WorkType', jobData.jobType);
        formData.append('JobCategory', jobData.field || "");
        formData.append('Location', jobData.location || "");
        formData.append('Vacancies', jobData.vacancies || 1);

        // Xử lý ngày tháng - đảm bảo định dạng đúng
        if (jobData.deadline) {
            const deadlineDate = new Date(jobData.deadline);
            formData.append('ApplicationDeadline', deadlineDate.toISOString());
        }

        // Xử lý languages - chuyển array thành string
        if (jobData.languages && Array.isArray(jobData.languages)) {
            formData.append('LanguagesRequired', jobData.languages.join(','));
        } else if (jobData.languages) {
            formData.append('LanguagesRequired', jobData.languages);
        }

        // Log để kiểm tra dữ liệu gửi đi
        console.log("Dữ liệu gửi đi:", Object.fromEntries(formData));

        const response = await axios.post(`${BASE_URL}/Employer/JobPosting`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        return response.data;
    } catch (err) {
        console.error("Error full details:", err);
        if (err.response) {
            console.error("Response data:", err.response.data);
            console.error("Response status:", err.response.status);
        } else {
            console.error("No response received from server");
        }
        throw handleError(err);
    }
};

export const updateJob = async(id, jobData) => {
    try {
        // Tạo FormData để gửi dữ liệu
        const formData = new FormData();

        // Chuyển đổi dữ liệu từ cấu trúc EditJob sang cấu trúc API
        // Sử dụng tên trường đúng theo UpdateJobPostingDto
        if (jobData.jobTitle) formData.append('JobTitle', jobData.jobTitle);
        if (jobData.jobDescription) formData.append('JobDesc', jobData.jobDescription);
        if (jobData.jobRequirements) formData.append('SkillsRequired', jobData.jobRequirements);
        if (jobData.salary) formData.append('Salary', jobData.salary);
        if (jobData.experience) formData.append('ExperienceRequired', jobData.experience);
        if (jobData.jobType) formData.append('WorkType', jobData.jobType);
        if (jobData.field) formData.append('JobCategory', jobData.field);
        if (jobData.location) formData.append('Location', jobData.location);
        if (jobData.vacancies) formData.append('Vacancies', jobData.vacancies);

        // Xử lý ngày tháng - đảm bảo định dạng đúng
        if (jobData.deadline) {
            const deadlineDate = new Date(jobData.deadline);
            formData.append('ApplicationDeadline', deadlineDate.toISOString());
        }

        // Xử lý languages - chuyển array thành string
        if (jobData.languages && Array.isArray(jobData.languages)) {
            formData.append('LanguagesRequired', jobData.languages.join(','));
        } else if (jobData.languages) {
            formData.append('LanguagesRequired', jobData.languages);
        }

        // Log để kiểm tra dữ liệu gửi đi
        console.log("Dữ liệu cập nhật:", Object.fromEntries(formData));

        const response = await axios.put(`${BASE_URL}/Employer/JobPosting/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        return response.data;
    } catch (err) {
        console.error("Error full details:", err);
        if (err.response) {
            console.error("Response data:", err.response.data);
            console.error("Response status:", err.response.status);
        } else {
            console.error("No response received from server");
        }
        throw handleError(err);
    }
};

export const deleteJob = async(id) => {
    try {
        await axiosInstance.delete(`/Employer/JobPosting/${id}`);
        return true;
    } catch (err) {
        throw handleError(err);
    }
};

// API endpoints cho Admin (cần đăng nhập với role Admin)
export const getPendingJobs = async() => {
    try {
        const response = await axiosInstance.get('/Admin/JobPosting/Pending');
        return response.data;
    } catch (err) {
        throw handleError(err);
    }
};

export const approveJob = async(id) => {
    try {
        const response = await axiosInstance.patch(`/Admin/JobPosting/${id}/Approve`);
        return response.data;
    } catch (err) {
        throw handleError(err);
    }
};

export const rejectJob = async(id) => {
    try {
        const response = await axiosInstance.patch(`/Admin/JobPosting/${id}/Reject`);
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