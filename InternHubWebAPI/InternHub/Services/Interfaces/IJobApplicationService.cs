using System;
using static InternHub.DTOs.JobApplication.JobApplicationDto;

namespace InternHub.Services.Interfaces
{
    public interface IJobApplicationService
    {
        Task<string> ApplyAsync(string userId, ApplicationCreateDto dto);
        Task<IEnumerable<ApplicationViewDto>> GetApplicationsByJobPostingAsync(int jobPostingId);
    }
}

