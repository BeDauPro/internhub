using System.Collections.Generic;
using System.Threading.Tasks;
using InternHub.Models.Enums;
using InternHub.DTOs.JobPosting;
using InternHub.DTOs.Common;

namespace InternHub.Services.Interfaces
{
    public interface IJobPostingService
    {
        // CREATE - Tạo JobPosting mới (EmployerId được truyền từ controller)
        Task<JobPostingResponseDto> CreateJobPostingAsync(CreateJobPostingDto createDto, int employerId);

        // READ - Đọc JobPosting theo ID (chi tiết)
        Task<JobPostingDetailDto> GetJobPostingByIdAsync(int id);

        // READ - Lấy thông tin đầy đủ của JobPosting (bao gồm Status và EmployerId)
        Task<JobPostingResponseDto> GetFullJobPostingDetailsAsync(int id);

        // READ - Lấy tất cả JobPosting theo vai trò
        Task<IEnumerable<JobPostingListDto>> GetAllJobPostingsAsync(string userRole = null);

        // READ - Lấy JobPosting theo filter
        Task<IEnumerable<JobPostingListDto>> GetFilteredJobPostingsAsync(string category, string location, string workType);

        // READ - Admin lấy JobPosting có status Pending
        Task<IEnumerable<JobPostingResponseDto>> GetPendingJobPostingsAsync();

        // READ - Employer lấy JobPosting của họ (dạng đầy đủ)
        Task<IEnumerable<JobPostingResponseDto>> GetEmployerJobPostingsAsync(int employerId);

        // READ - Employer lấy JobPosting của họ (dạng danh sách, chỉ lấy status Accept)
        Task<IEnumerable<JobPostingListDto>> GetEmployerJobPostingsListAsync(int employerId);

        // UPDATE - Cập nhật JobPosting
        Task<JobPostingResponseDto> UpdateJobPostingAsync(int id, UpdateJobPostingDto updateDto, int employerId);

        // UPDATE - Admin cập nhật trạng thái JobPosting
        Task<JobPostingResponseDto> UpdateJobPostingStatusAsync(int id, JobpostingStatus? status);

        // DELETE - Xóa JobPosting
        Task<bool> DeleteJobPostingAsync(int id, int employerId);
        //Filter cho jobposting
        Task<PagedResult<JobPostingListDto>> GetFilteredPagedJobPostingsAsync(
          string? searchTerm = null,
          string? workType = null,
          string? location = null,
          string? jobCategory = null,
          string? sortDirection = "desc",
          int pageNumber = 1,
          int pageSize = 8);
    }
}