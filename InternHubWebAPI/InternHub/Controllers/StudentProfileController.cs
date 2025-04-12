using System.Security.Claims;
using InternHub.DTOs.Student;
using InternHub.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InternHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private readonly IStudentService _studentService;
        private readonly IWebHostEnvironment _env;

        public StudentsController(IStudentService studentService, IWebHostEnvironment env)
        {
            _studentService = studentService;
            _env = env;
        }

        //fillter cho quản lí sinh viên
        [HttpGet("admin/paged")]
        public async Task<IActionResult> GetPagedStudents(
        [FromQuery] string? fullName,
        [FromQuery] string? schoolEmail,
        [FromQuery] string? status, // Thêm tham số để lọc theo status
        [FromQuery] string? timeFilter, // Thêm tham số để lọc theo thời gian nộp đơn
        [FromQuery] string? sortBy = "FullName",
        [FromQuery] string? sortDirection = "asc",
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
        {
            var result = await _studentService.GetStudentsAsync(fullName, schoolEmail, status, timeFilter, sortBy, sortDirection, pageNumber, pageSize);
            return Ok(result);
        }

        [Authorize(Roles = "Employer")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var students = await _studentService.GetAllAsync(isStudent: true);
            return Ok(students);
        }

        [HttpGet("me")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> GetMyProfile(){
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var student = await _studentService.GetByUserIdAsync(userId);
            return student == null ? NotFound(): Ok(student);
        }

        [Authorize(Roles = "Student")]
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] CreateStudentDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var created = await _studentService.CreateAsync(dto, userId, _env);
            return Ok(created);
        }

        [Authorize(Roles = "Student,Employer")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] UpdateStudentDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isEmployer = User.IsInRole("Employer");
            var isStudent = User.IsInRole("Student");

            if (isEmployer && dto.HasNonStatusFields())
            {
                return StatusCode(StatusCodes.Status403Forbidden, new { message = "Employer chỉ được phép cập nhật status sinh viên." });
            }

            if (isStudent && dto.Status != null)
            {
                return StatusCode(StatusCodes.Status403Forbidden, new { message = "Bạn không có quyền cập nhật trạng thái sinh viên." });
            }

            var updated = await _studentService.UpdateAsync(id, dto, _env, isEmployer, userId);
            if (updated == null) return NotFound();
            return Ok(updated);
        }


        [Authorize(Roles = "Student")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var deleted = await _studentService.DeleteAsync(id, userId);
            return deleted ? NoContent() : NotFound();
        }

        [HttpGet("statuses")]
        [Authorize(Roles ="Employer")]
        public IActionResult GetStatuses()
        {
            var statuses = _studentService.GetStatuses();
            return Ok(statuses);
        }
    }
}
