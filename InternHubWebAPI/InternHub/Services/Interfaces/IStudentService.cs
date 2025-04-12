using InternHub.DTOs.Common;
using InternHub.DTOs.Student;

namespace InternHub.Services.Interfaces
{
    public interface IStudentService
    {
        // Cập nhật phương thức trong interface IStudentService
        Task<PagedResult<StudentDto>> GetStudentsAsync(
            string? fullName,
            string? schoolEmail,
            string? status,
            string? timeFilter,
            string? sortBy,
            string? sortDirection,
            int pageNumber,
            int pageSize);
        Task<List<StudentDto>> GetAllAsync(bool isStudent = false);
        Task<StudentDto?> GetByUserIdAsync(string userID);
        Task<StudentDto?> GetByIdAsync(int id);
        Task<StudentDto> CreateAsync(CreateStudentDto dto, string userId, IWebHostEnvironment env);
        Task<StudentDto> UpdateAsync(int id, UpdateStudentDto dto, IWebHostEnvironment env, bool isEmployer, string userId);
        Task<bool> DeleteAsync(int id,  string userId);
        List<string> GetStatuses();
    }
}
