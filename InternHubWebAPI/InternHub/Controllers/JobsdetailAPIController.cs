using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InternHub.Models;
using InternHub.Models.ViewModels;

namespace InternHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobDetailApiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public JobDetailApiController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/JobDetailApi/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<JobDetailViewModel>> GetJobDetail(int id)
        {
            try
            {
                // Tìm job posting theo id
                var jobPosting = await _context.JobPostings
                    .Include(j => j.Employer)
                    .FirstOrDefaultAsync(j => j.JobPostingId == id);

                if (jobPosting == null)
                {
                    return NotFound(new { message = $"Không tìm thấy công việc với ID: {id}" });
                }

                // Tạo view model với thông tin chi tiết
                var jobDetail = new JobDetailViewModel
                {
                    JobPostingId = jobPosting.JobPostingId,
                    JobTitle = jobPosting.JobTitle ?? string.Empty,
                    JobDesc = jobPosting.JobDesc ?? string.Empty,
                    JobCategory = jobPosting.JobCategory ?? string.Empty,
                    Location = jobPosting.Location ?? string.Empty,
                    Salary = jobPosting.Salary ?? string.Empty,
                    WorkType = jobPosting.WorkType ?? string.Empty,
                    ExperienceRequired = jobPosting.ExperienceRequired ?? string.Empty,
                    SkillsRequired = jobPosting.SkillsRequired ?? string.Empty,
                    LanguagesRequired = jobPosting.LanguagesRequired ?? string.Empty,
                    Vacancies = jobPosting.Vacancies,
                    PostedAt = jobPosting.PostedAt,
                    CompanyName = jobPosting.Employer?.CompanyName ?? string.Empty,
                    CompanyLogo = jobPosting.Employer?.CompanyLogo ?? string.Empty,
                    CompanyDescription = jobPosting.Employer?.CompanyDescription ?? string.Empty,
                    Industry = jobPosting.Employer?.Industry ?? string.Empty,
                    Website = jobPosting.Employer?.Website ?? string.Empty,
                    Address = jobPosting.Employer?.Address ?? string.Empty
                };

                return Ok(jobDetail);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}