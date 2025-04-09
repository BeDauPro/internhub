using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using InternHub.Models.ViewModels;
using InternHub.Services;
using InternHub.Models.Enums;

namespace InternHub.Controllers
{
    [Route("api/admin/jobpostings")]
    [ApiController]
    //[Authorize(Roles = "Admin")]
    public class JobPostingAdminController : ControllerBase
    {
        private readonly IJobPostingService _jobPostingService;

        public JobPostingAdminController(IJobPostingService jobPostingService)
        {
            _jobPostingService = jobPostingService;
        }

        // GET: api/admin/jobpostings/pending
        [HttpGet("pending")]
        public async Task<ActionResult<IEnumerable<JobPostingResponseDto>>> GetPendingJobPostings()
        {
            try
            {
                // Lấy các bài đăng đang chờ duyệt
                var pendingJobPostings = await _jobPostingService.GetAllJobPostingsAsync("Admin");
                return Ok(pendingJobPostings);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // PATCH: api/admin/jobpostings/{id}/approve
        [HttpPatch("{id}/approve")]
        public async Task<ActionResult<JobPostingResponseDto>> ApproveJobPosting(int id)
        {
            try
            {
                // Cập nhật trạng thái thành "Accept"
                var result = await _jobPostingService.UpdateJobPostingStatusAsync(id, JobpostingStatus.Accept);

                if (result == null)
                {
                    return NotFound(new { message = $"Không tìm thấy bài đăng với ID: {id} hoặc bài đăng đã hết hạn" });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // PATCH: api/admin/jobpostings/{id}/reject
        [HttpPatch("{id}/reject")]
        public async Task<ActionResult<JobPostingResponseDto>> RejectJobPosting(int id)
        {
            try
            {
                // Cập nhật trạng thái thành "Reject"
                var result = await _jobPostingService.UpdateJobPostingStatusAsync(id, JobpostingStatus.Reject);

                if (result == null)
                {
                    return NotFound(new { message = $"Không tìm thấy bài đăng với ID: {id} hoặc bài đăng đã hết hạn" });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // GET: api/admin/jobpostings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<JobPostingResponseDto>>> GetAllJobPostings()
        {
            try
            {
                // Admin có thể xem tất cả bài đăng (không lọc theo vai trò)
                var jobPostings = await _jobPostingService.GetAllJobPostingsAsync();
                return Ok(jobPostings);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // GET: api/admin/jobpostings/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<JobPostingResponseDto>> GetJobPostingById(int id)
        {
            try
            {
                var jobPosting = await _jobPostingService.GetJobPostingByIdAsync(id);
                if (jobPosting == null)
                {
                    return NotFound(new { message = $"Không tìm thấy bài đăng với ID: {id}" });
                }
                return Ok(jobPosting);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // DELETE: api/admin/jobpostings/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteJobPosting(int id)
        {
            try
            {
                var result = await _jobPostingService.DeleteJobPostingAsync(id);
                if (!result)
                {
                    return NotFound(new { message = $"Không tìm thấy bài đăng với ID: {id}" });
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