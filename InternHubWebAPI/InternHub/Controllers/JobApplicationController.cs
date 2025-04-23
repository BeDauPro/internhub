using System.Security.Claims;
using InternHub.DTOs.JobApplication;
using InternHub.Models.Enums;
using InternHub.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InternHub.Controllers
{
    [Route("api/applications")]
    [ApiController]
    public class JobApplicationController : ControllerBase
    {
        private readonly IJobApplicationService _jobApplicationService;

        public JobApplicationController(IJobApplicationService jobApplicationService)
        {
            _jobApplicationService = jobApplicationService;
        }

        [HttpPost("apply")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> Apply([FromBody] JobApplicationDto.ApplicationCreateDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized(new { message = "User is not authenticated." });
            }

            try
            {
                var result = await _jobApplicationService.ApplyAsync(userId, dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("job/{jobPostingId}")]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> GetApplicationsByJobPosting(int jobPostingId)
        {
            try
            {
                var applications = await _jobApplicationService.GetApplicationsByJobPostingAsync(jobPostingId);
                return Ok(applications);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("student/history")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> GetApplicationHistory()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized(new { message = "User is not authenticated." });
            }

            try
            {
                var history = await _jobApplicationService.GetApplicationHistoryByStudentAsync(userId);
                return Ok(history);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("application/{applicationId}/status")]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> UpdateApplicationStatus(int applicationId, [FromBody] StudentStatus newStatus)
        {
            try
            {
                var result = await _jobApplicationService.UpdateApplicationStatusAsync(applicationId, newStatus);
                if (result)
                {
                    return Ok(new { message = "Application status updated successfully." });
                }
                return BadRequest(new { message = "Failed to update application status." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // New API for admins to view all applications
        [HttpGet("admin/all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllApplicationsForAdmin()
        {
            try
            {
                var applications = await _jobApplicationService.GetAllApplicationsForAdminAsync();
                return Ok(applications);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // New API for employers to view candidates for their job postings
        [HttpGet("employer/candidates")]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> GetCandidatesForEmployer()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized(new { message = "User is not authenticated." });
            }

            try
            {
                var candidates = await _jobApplicationService.GetCandidatesForEmployerAsync(userId);
                return Ok(candidates);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}