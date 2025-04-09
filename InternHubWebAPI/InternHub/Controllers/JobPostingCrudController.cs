using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using InternHub.Models.ViewModels;
using InternHub.Services;
using InternHub.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Linq;

namespace InternHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobPostingCrudController : ControllerBase
    {
        private readonly IJobPostingService _jobPostingService;

        public JobPostingCrudController(IJobPostingService jobPostingService)
        {
            _jobPostingService = jobPostingService;
        }

        // CREATE: api/JobPostingCrud
        [HttpPost]
        [Authorize(Roles = "Employee")]
        public async Task<ActionResult<JobPostingResponseDto>> CreateJobPosting([FromBody] CreateJobPostingDto createDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // Lấy EmployerId từ claim nếu có
                if (User.HasClaim(c => c.Type == "EmployerId"))
                {
                    var employerId = int.Parse(User.FindFirstValue("EmployerId"));
                    createDto.EmployerId = employerId;
                }

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

                // Kiểm tra quyền xem bài đăng dựa trên vai trò và trạng thái
                if (User.Identity.IsAuthenticated)
                {
                    // Admin có thể xem tất cả bài đăng
                    if (User.IsInRole("Admin"))
                    {
                        return Ok(jobPosting);
                    }
                    // Employee chỉ có thể xem bài đăng của họ
                    else if (User.IsInRole("Employee"))
                    {
                        if (User.HasClaim(c => c.Type == "EmployerId"))
                        {
                            var employerId = int.Parse(User.FindFirstValue("EmployerId"));
                            if (jobPosting.EmployerId == employerId)
                            {
                                return Ok(jobPosting);
                            }
                        }
                    }
                    // Student chỉ có thể xem bài đăng đã được chấp nhận
                    else if (User.IsInRole("Student"))
                    {
                        if (jobPosting.Status == InternHub.Models.Enums.JobpostingStatus.Accept)
                        {
                            return Ok(jobPosting);
                        }
                    }
                }
                else
                {
                    // Người dùng không đăng nhập chỉ có thể xem bài đăng đã được chấp nhận
                    if (jobPosting.Status == InternHub.Models.Enums.JobpostingStatus.Accept)
                    {
                        return Ok(jobPosting);
                    }
                }

                // Nếu không có quyền xem
                return Forbid();
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
                string userRole = null;

                // Xác định vai trò người dùng
                if (User.Identity.IsAuthenticated)
                {
                    if (User.IsInRole("Admin"))
                    {
                        userRole = "Admin";
                    }
                    else if (User.IsInRole("Student"))
                    {
                        userRole = "Student";
                    }
                    else if (User.IsInRole("Employee"))
                    {
                        userRole = "Employee";
                    }
                }
                else
                {
                    // Người dùng không đăng nhập sẽ thấy các bài đăng đã được chấp nhận
                    userRole = "Student"; // Sử dụng cùng bộ lọc với Student
                }

                // Nếu có tham số filter, gọi phương thức lọc
                if (!string.IsNullOrEmpty(category) || !string.IsNullOrEmpty(location) || !string.IsNullOrEmpty(workType))
                {
                    var filteredJobs = await _jobPostingService.GetFilteredJobPostingsAsync(category, location, workType);

                    // Lọc thêm theo trạng thái dựa trên vai trò
                    if (userRole == "Student" || userRole == "Employee" || userRole == null)
                    {
                        filteredJobs = filteredJobs.Where(j => j.Status == InternHub.Models.Enums.JobpostingStatus.Accept);
                    }

                    return Ok(filteredJobs);
                }

                // Nếu không có tham số filter, lấy tất cả với bộ lọc theo vai trò
                var jobPostings = await _jobPostingService.GetAllJobPostingsAsync(userRole);
                return Ok(jobPostings);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // UPDATE: api/JobPostingCrud/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Employee")]
        public async Task<ActionResult> UpdateJobPosting(int id, [FromBody] UpdateJobPostingDto updateDto)
        {
            try
            {
                // Kiểm tra quyền sở hữu bài đăng
                var existingJobPosting = await _jobPostingService.GetJobPostingByIdAsync(id);
                if (existingJobPosting == null)
                {
                    return NotFound(new { message = $"Không tìm thấy job posting với Id: {id}" });
                }

                // Kiểm tra xem nhà tuyển dụng có quyền cập nhật bài đăng này không
                if (User.HasClaim(c => c.Type == "EmployerId"))
                {
                    var employerId = int.Parse(User.FindFirstValue("EmployerId"));
                    if (existingJobPosting.EmployerId != employerId)
                    {
                        return Forbid();
                    }
                }

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
        [Authorize(Roles = "Employee,Admin")]
        public async Task<ActionResult> DeleteJobPosting(int id)
        {
            try
            {
                // Kiểm tra quyền xóa bài đăng
                var existingJobPosting = await _jobPostingService.GetJobPostingByIdAsync(id);
                if (existingJobPosting == null)
                {
                    return NotFound(new { message = $"Không tìm thấy job posting với Id: {id}" });
                }

                // Admin có thể xóa bất kỳ bài đăng nào
                if (!User.IsInRole("Admin"))
                {
                    // Nhà tuyển dụng chỉ có thể xóa bài đăng của họ
                    if (User.HasClaim(c => c.Type == "EmployerId"))
                    {
                        var employerId = int.Parse(User.FindFirstValue("EmployerId"));
                        if (existingJobPosting.EmployerId != employerId)
                        {
                            return Forbid();
                        }
                    }
                    else
                    {
                        return Forbid();
                    }
                }

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