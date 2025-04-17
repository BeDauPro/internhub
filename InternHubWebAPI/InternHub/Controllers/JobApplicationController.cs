using System.Security.Claims;
using InternHub.DTOs.JobApplication;
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
    }
}
