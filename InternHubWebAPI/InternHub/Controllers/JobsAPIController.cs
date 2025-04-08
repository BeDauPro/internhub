using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InternHub.Models;
using InternHub.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;

namespace InternHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Student, Admin, Employee")]
    
    public class JobsApiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public JobsApiController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/JobsApi
        [HttpGet]
        
        public async Task<ActionResult<IEnumerable<JobPostingViewModel>>> GetAllJobs()
        {
            try
            {
                // Lấy tất cả job postings
                var jobs = await _context.JobPostings.ToListAsync();

                // Lấy tất cả employers
                var employers = await _context.Set<Employer>().ToDictionaryAsync(e => e.EmployerId, e => e);

                // Tạo kết quả
                var result = jobs.Select(j => new JobPostingViewModel
                {
                    JobPostingId = j.JobPostingId,
                    JobTitle = j.JobTitle ?? string.Empty,
                    JobCategory = j.JobCategory ?? string.Empty,
                    Location = j.Location ?? string.Empty,
                    WorkType = j.WorkType ?? string.Empty,
                    Vacancies = j.Vacancies,
                    PostedAt = j.PostedAt,
                    CompanyName = employers.TryGetValue(j.EmployerId, out var employer) ? employer.CompanyName ?? string.Empty : string.Empty,
                    CompanyLogo = employers.TryGetValue(j.EmployerId, out employer) ? employer.CompanyLogo ?? string.Empty : string.Empty
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}