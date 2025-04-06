using System.Collections.Generic;
using System.Threading.Tasks;
using InternHub.Models;
using InternHub.Models.ViewModels;

namespace InternHub.Services
{
    public interface IJobPostingService
    {
        // CREATE
        Task<JobPostingResponseDto> CreateJobPostingAsync(CreateJobPostingDto createDto);

        // READ (sẽ triển khai sau)
        Task<JobPostingResponseDto> GetJobPostingByIdAsync(int id);
        Task<IEnumerable<JobPostingResponseDto>> GetAllJobPostingsAsync();
        Task<IEnumerable<JobPostingResponseDto>> GetFilteredJobPostingsAsync(string category, string location, string workType);

        // UPDATE (sẽ triển khai sau)
        Task<JobPostingResponseDto> UpdateJobPostingAsync(int id, UpdateJobPostingDto updateDto);

        // DELETE (sẽ triển khai sau)
        Task<bool> DeleteJobPostingAsync(int id);
    }
}