using System.Collections.Generic;
using System.Threading.Tasks;
using InternHub.Models;
using InternHub.Models.ViewModels;
using InternHub.Models.Enums;

namespace InternHub.Services
{
    public interface IJobPostingService
    {
        // CREATE
        Task<JobPostingResponseDto> CreateJobPostingAsync(CreateJobPostingDto createDto);

        // READ
        Task<JobPostingResponseDto> GetJobPostingByIdAsync(int id);
        Task<IEnumerable<JobPostingResponseDto>> GetAllJobPostingsAsync(string userRole = null);
        Task<IEnumerable<JobPostingResponseDto>> GetFilteredJobPostingsAsync(string category, string location, string workType);

        // UPDATE
        Task<JobPostingResponseDto> UpdateJobPostingAsync(int id, UpdateJobPostingDto updateDto);

        // Phương thức cập nhật trạng thái bài đăng 
        Task<JobPostingResponseDto> UpdateJobPostingStatusAsync(int id, JobpostingStatus? status);

        // DELETE
        Task<bool> DeleteJobPostingAsync(int id);
    }
}