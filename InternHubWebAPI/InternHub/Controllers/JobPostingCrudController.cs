using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using InternHub.Models.ViewModels;
using InternHub.Services;
using InternHub.Models;
using Microsoft.AspNetCore.Authorization;

namespace InternHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles ="Employee")]
    public class JobPostingCrudController : ControllerBase
    {
        private readonly IJobPostingService _jobPostingService;

        public JobPostingCrudController(AppDbContext context)
        {
            // Khởi tạo service trực tiếp
            _jobPostingService = new JobPostingService(context);
        }

        // CREATE: api/JobPostingCrud
        [HttpPost]
        public async Task<ActionResult<JobPostingResponseDto>> CreateJobPosting([FromBody] CreateJobPostingDto createDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var result = await _jobPostingService.CreateJobPostingAsync(createDto);
                return CreatedAtAction(nameof(GetJobPosting), new { id = result.JobPostingId }, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // READ: api/JobPostingCrud/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<JobPostingResponseDto>> GetJobPosting(int id)
        {
            try
            {
                var jobPosting = await _jobPostingService.GetJobPostingByIdAsync(id);
                if (jobPosting == null)
                {
                    return NotFound(new { message = $"Không tìm thấy job posting với Id: {id}" });
                }
                return Ok(jobPosting);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // READ ALL: api/JobPostingCrud
        [HttpGet]
        public async Task<ActionResult> GetAllJobPostings(
            [FromQuery] string category = null,
            [FromQuery] string location = null,
            [FromQuery] string workType = null)
        {
            try
            {
                // Nếu có tham số filter, gọi phương thức lọc
                if (!string.IsNullOrEmpty(category) || !string.IsNullOrEmpty(location) || !string.IsNullOrEmpty(workType))
                {
                    var filteredJobs = await _jobPostingService.GetFilteredJobPostingsAsync(category, location, workType);
                    return Ok(filteredJobs);
                }

                // Nếu không có tham số filter, lấy tất cả
                var jobPostings = await _jobPostingService.GetAllJobPostingsAsync();
                return Ok(jobPostings);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // UPDATE: api/JobPostingCrud/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateJobPosting(int id, [FromBody] UpdateJobPostingDto updateDto)
        {
            try
            {
                var result = await _jobPostingService.UpdateJobPostingAsync(id, updateDto);
                if (result == null)
                {
                    return NotFound(new { message = $"Không tìm thấy job posting với Id: {id}" });
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // DELETE: api/JobPostingCrud/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteJobPosting(int id)
        {
            try
            {
                var result = await _jobPostingService.DeleteJobPostingAsync(id);
                if (!result)
                {
                    return NotFound(new { message = $"Không tìm thấy job posting với Id: {id}" });
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}