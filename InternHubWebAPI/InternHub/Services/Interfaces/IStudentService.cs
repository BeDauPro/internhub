using InternHub.DTOs.Student;

namespace InternHub.Services.Interfaces
{
    public interface IStudentService
    {
        Task<List<StudentDto>> GetAllAsync();
        Task<StudentDto> GetByIdAsync(int id);
        Task<StudentDto> CreateAsync(CreateStudentDto dto, IWebHostEnvironment env);
        Task<StudentDto> UpdateAsync(int id, UpdateStudentDto dto, IWebHostEnvironment env);
        Task<bool> DeleteAsync(int id);
        List<string> GetStatuses();
    }
}
