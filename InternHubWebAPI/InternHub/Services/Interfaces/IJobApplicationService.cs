using System;
using InternHub.Models;
using InternHub.Models.Enums;
using static InternHub.DTOs.JobApplication.JobApplicationDto;
using static InternHub.Services.JobApplicationService;

namespace InternHub.Services.Interfaces
{
    public interface IJobApplicationService
    {
        //Task<string> ApplyAsync(string userId, ApplicationCreateDto dto);
        Task<ResultDto> ApplyAsync(string userId, ApplicationCreateDto dto);
        Task<IEnumerable<ApplicationViewDto>> GetApplicationsByJobPostingAsync(int jobPostingId);
        Task<List<ApplicationHistoryDto>> GetApplicationHistoryByStudentAsync(string userId);
        Task<bool> UpdateApplicationStatusAsync(int applicationId, StudentStatus newStatus, string employerId);
        // New methods for admin and employer views
        Task<IEnumerable<StudentViewDto>> GetAllStudentsForAdminAsync();
        Task<IEnumerable<EmployerCandidateViewDto>> GetCandidatesForEmployerAsync(string userId);
    }
}