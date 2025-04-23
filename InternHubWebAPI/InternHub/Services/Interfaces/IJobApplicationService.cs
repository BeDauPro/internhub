using System;
using InternHub.Models;
using InternHub.Models.Enums;
using static InternHub.DTOs.JobApplication.JobApplicationDto;

namespace InternHub.Services.Interfaces
{
    public interface IJobApplicationService
    {
        Task<string> ApplyAsync(string userId, ApplicationCreateDto dto);
        Task<IEnumerable<ApplicationViewDto>> GetApplicationsByJobPostingAsync(int jobPostingId);
        Task<List<ApplicationHistoryDto>> GetApplicationHistoryByStudentAsync(string userId);
        Task<bool> UpdateApplicationStatusAsync(int applicationId, StudentStatus newStatus, string employerId);
    }
}

