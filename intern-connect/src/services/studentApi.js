import axios from 'axios';

const BASE_URL = 'https://localhost:7286/api/students';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
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
export const getAllStudents = async() => {
    const response = await axiosInstance.get('/');
    return response.data;
};

// Lấy thông tin sinh viên hiện tại (theo token)
export const getStudentProfile = async() => {
    try {
        const response = await axiosInstance.get('/me');
        return response.data;
    } catch (error) {
        console.error('Error fetching student profile:', error);
        throw error;
    }
};
export { getStudentProfile as fetchStudentProfile };

//Lấy thông tin sinh viên theo ID (cho Admin)
export const getStudentById = async(studentId) => {
    try {
        const response = await axiosInstance.get(`/${studentId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching student with ID ${studentId}:`, error);
        throw error;
    }
};

// Tạo sinh viên mới (FormData gồm ảnh/avatar + dữ liệu)
export const createStudent = async(formData) => {
    const response = await axiosInstance.post('/', formData);
    return response.data;
};

// Cập nhật sinh viên (formData phải là FormData nếu có ảnh/file)
export const updateStudent = async(id, formData) => {
    const response = await axiosInstance.put(`/${id}`, formData);
    return response.data;
};

// Cập nhật ảnh đại diện/CV (1 file duy nhất - backend sẽ tự xác định là avatar hay CV)
export const updateAvatar = async(id, file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.put(`/${id}/update-single-file`, formData);
    console.log('Avatar update response:', response.data);
    sessionStorage.setItem('Profile Update Image', response.data.url) // Log the response for debugging
    return response.data; // Ensure this returns the updated profilePicture URL
};

// Tạo ảnh đại diện mới (1 file duy nhất)
export const createAvatar = async(file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post('/create-single-file', formData);
    console.log('Avatar creation response:', response.data);
    return response.data; // Ensure this returns the created avatar URL or relevant data
};

export const deleteStudent = async(id) => {
    const response = await axiosInstance.delete(`/${id}`);
    return response.status === 204;
};

export const getStudentStatuses = async() => {
    const response = await axiosInstance.get('/statuses');
    return response.data;
};

export const getRoleFromStorage = () => {
    try {
      const role = localStorage.getItem('role'); 
      return role || null; 
    } catch (error) {
      console.error('Error retrieving role from storage:', error);
      return null;
    }
  };
  
  
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
        const response = await axiosInstance.get('/events');
        return response.data;
    } catch (err) {
        throw handleError(err);
    }
};

// Get Event by ID
export const getStudentEventById = async(id) => {
    try {
        const response = await axiosInstance.get(`/events/${id}`);
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

