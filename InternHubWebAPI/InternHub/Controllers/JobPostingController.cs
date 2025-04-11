using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Linq;
using InternHub.Models.Enums;
using InternHub.DTOs.JobPosting;
using InternHub.Services.Interfaces;

namespace InternHub.Controllers
{
    [ApiController]
    public class JobPostingController : ControllerBase
    {
        private readonly IJobPostingService _jobPostingService;

        public JobPostingController(IJobPostingService jobPostingService)
        {
            _jobPostingService = jobPostingService;
        }

        #region Public Endpoints (JobPostings với status Accept)

        // GET: api/JobPosting - Lấy tất cả JobPostings có status Accept
        [Route("api/JobPosting")]
        [HttpGet]
        public async Task<ActionResult> GetAllAcceptedJobPostings(
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

                // Lấy tất cả JobPosting với status Accept
                var jobPostings = await _jobPostingService.GetAllJobPostingsAsync("Student");
                return Ok(jobPostings);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // GET: api/JobPosting/{id} - Lấy chi tiết một bài đăng
        [Route("api/JobPosting/{id}")]
        [HttpGet]
        public async Task<ActionResult<JobPostingDetailDto>> GetJobPostingById(int id)
        {
            try
            {
                var jobPosting = await _jobPostingService.GetJobPostingByIdAsync(id);
                if (jobPosting == null)
                {
                    return NotFound(new { message = $"Không tìm thấy job posting với Id: {id}" });
                }

                // Dùng GetFullJobPostingDetails để kiểm tra quyền truy cập
                var fullDetails = await _jobPostingService.GetFullJobPostingDetailsAsync(id);

                // Chỉ trả về JobPosting có status Accept nếu người dùng không phải Admin hoặc Employer sở hữu bài đăng
                if (User.Identity.IsAuthenticated)
                {
                    if (User.IsInRole("Admin"))
                    {
                        return Ok(jobPosting);
                    }
                    else if (User.IsInRole("Employer") && User.HasClaim(c => c.Type == "EmployerId"))
                    {
                        var employerId = int.Parse(User.FindFirstValue("EmployerId"));
                        if (fullDetails != null && fullDetails.EmployerId == employerId)
                        {
                            return Ok(jobPosting);
                        }
                    }
                }

                // Người dùng khác (Student hoặc không đăng nhập) chỉ được xem JobPosting có status Accept
                if (fullDetails != null && fullDetails.Status == JobpostingStatus.Accept)
                {
                    return Ok(jobPosting);
                }

                return Forbid();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        #endregion

        #region Employer Endpoints

        // CREATE: api/Employer/JobPosting
        [Route("api/Employer/JobPosting")]
        [HttpPost]
        [Authorize(Roles = "Employer")]
        public async Task<ActionResult<JobPostingResponseDto>> CreateJobPosting([FromForm] CreateJobPostingDto createDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // Lấy EmployerId từ claim khi employer đăng nhập
                if (!User.HasClaim(c => c.Type == "EmployerId"))
                {
                    return BadRequest(new { error = "EmployerId không được tìm thấy trong token" });
                }

                var employerId = int.Parse(User.FindFirstValue("EmployerId"));
                var result = await _jobPostingService.CreateJobPostingAsync(createDto, employerId);
                return CreatedAtAction(nameof(GetJobPostingById), new { id = result.JobPostingId }, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // UPDATE: api/Employer/JobPosting/{id}
        [Route("api/Employer/JobPosting/{id}")]
        [HttpPut]
        [Authorize(Roles = "Employer")]
        public async Task<ActionResult> UpdateJobPosting(int id, [FromForm] UpdateJobPostingDto updateDto)
        {
            try
            {
                if (!User.HasClaim(c => c.Type == "EmployerId"))
                {
                    return BadRequest(new { error = "EmployerId không được tìm thấy trong token" });
                }

                var employerId = int.Parse(User.FindFirstValue("EmployerId"));
                var result = await _jobPostingService.UpdateJobPostingAsync(id, updateDto, employerId);

                if (result == null)
                {
                    return NotFound(new { message = $"Không tìm thấy job posting với Id: {id} hoặc không có quyền cập nhật" });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // DELETE: api/Employer/JobPosting/{id}
        [Route("api/Employer/JobPosting/{id}")]
        [HttpDelete]
        [Authorize(Roles = "Employer")]
        public async Task<ActionResult> DeleteJobPosting(int id)
        {
            try
            {
                if (!User.HasClaim(c => c.Type == "EmployerId"))
                {
                    return BadRequest(new { error = "EmployerId không được tìm thấy trong token" });
                }

                var employerId = int.Parse(User.FindFirstValue("EmployerId"));
                var result = await _jobPostingService.DeleteJobPostingAsync(id, employerId);

                if (!result)
                {
                    return NotFound(new { message = $"Không tìm thấy job posting với Id: {id} hoặc không có quyền xóa" });
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // GET: api/Employer/JobPosting - Lấy tất cả JobPosting của employer hiện tại
        [Route("api/Employer/JobPosting")]
        [HttpGet]
        [Authorize(Roles = "Employer")]
        public async Task<ActionResult> GetEmployerJobPostings()
        {
            try
            {
                if (!User.HasClaim(c => c.Type == "EmployerId"))
                {
                    return BadRequest(new { error = "EmployerId không được tìm thấy trong token" });
                }

                var employerId = int.Parse(User.FindFirstValue("EmployerId"));

                // Use the new method to get simplified data for list view với status Accept
                var jobPostings = await _jobPostingService.GetEmployerJobPostingsListAsync(employerId);
                return Ok(jobPostings);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        #endregion

        #region Admin Endpoints (Chỉ có 3 API: lấy bài đăng Pending, Approve, Reject)

        // GET: api/Admin/JobPosting/Pending - Lấy các bài đăng đang chờ duyệt
        [Route("api/Admin/JobPosting/Pending")]
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<JobPostingResponseDto>>> GetPendingJobPostings()
        {
            try
            {
                // Lấy các bài đăng đang chờ duyệt
                var pendingJobPostings = await _jobPostingService.GetPendingJobPostingsAsync();
                return Ok(pendingJobPostings);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // PATCH: api/Admin/JobPosting/{id}/Approve - Duyệt bài đăng
        [Route("api/Admin/JobPosting/{id}/Approve")]
        [HttpPatch]
        [Authorize(Roles = "Admin")]
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

        // PATCH: api/Admin/JobPosting/{id}/Reject - Từ chối bài đăng
        [Route("api/Admin/JobPosting/{id}/Reject")]
        [HttpPatch]
        [Authorize(Roles = "Admin")]
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

        #endregion
    }
}