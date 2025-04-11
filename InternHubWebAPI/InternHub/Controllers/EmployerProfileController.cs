using System.Security.Claims;
using InternHub.DTOs.Employer;
using InternHub.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InternHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployerProfileController : ControllerBase
    {
        private readonly IEmployerService _employerService;
        private readonly IWebHostEnvironment _env;

        public EmployerProfileController(IEmployerService employerService, IWebHostEnvironment env)
        {
            _employerService = employerService;
            _env = env;
        }
        [HttpGet("admin/paged")]
        public async Task<IActionResult> GetPagedEmployers([FromQuery] string? companyName, [FromQuery] string? address,
                                                            [FromQuery] string? sortBy = "companyName", [FromQuery] string? sortDirection = "asc",
                                                            [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var result = await _employerService.GetEmployersAsync(companyName, address, sortBy, sortDirection, pageNumber, pageSize);
            return Ok(result);
        }

        [HttpGet("filter")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> FilterEmployers(
            [FromQuery] string? companyName,
            [FromQuery] string? address,
            [FromQuery] string? sortBy = "CompanyName",
            [FromQuery] string? sortDirection = "asc",
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            var employers = await _employerService.GetEmployersAsync(companyName, address, sortBy, sortDirection, pageNumber, pageSize);
            return Ok(employers);
        }


        // GET: Get own employer profile by userId
        [HttpGet("me")]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> GetMyProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var employer = await _employerService.GetByUserIdAsync(userId);
            return employer == null ? NotFound() : Ok(employer);
        }

        // POST: Create new employer profile (linked to logged-in user)
        [HttpPost]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> Create([FromForm] CreateEmployer dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var created = await _employerService.CreateAsync(dto, userId, _env);
            return Ok(created);
        }

        // PUT: Update own profile
        [HttpPut("{id}")]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> Update(int id, [FromForm] UpdateEmployer dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var updated = await _employerService.UpdateAsync(id, dto, _env, userId);

            if (updated == null) return NotFound();
            return Ok(updated);
        }

        // DELETE: Only delete own profile
        [HttpDelete("{id}")]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var deleted = await _employerService.DeleteAsync(id, userId);
            return deleted ? NoContent() : NotFound();
        }
    }
}
