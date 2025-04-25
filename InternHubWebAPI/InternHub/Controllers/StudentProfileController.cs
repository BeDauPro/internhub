using System.Security.Claims;
using InternHub.DTOs.Student;
using InternHub.Models.ViewModels;
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
        [Authorize(Roles ="Admin")]
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

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var students = await _studentService.GetAllAsync(isStudent: true);
            return Ok(students);
        }

        [HttpGet("me")]
        [Authorize(Roles = "Student")] // Ensure the role matches the logged-in user's role
        public async Task<IActionResult> GetMyProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized(new { message = "User is not authenticated." });
            }

            var student = await _studentService.GetByUserIdAsync(userId);
            return student == null ? NotFound() : Ok(student);
        }

        [Authorize(Roles = "Student")]
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] CreateStudentDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var created = await _studentService.CreateAsync(dto, userId, _env);
            return Ok(created);
        }

        [Authorize(Roles = "Student")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] UpdateStudentDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            Console.WriteLine("Controller", dto);
            var updated = await _studentService.UpdateAsync(id, dto, _env, userId);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        [Authorize(Roles = "Student")]
        [HttpPost("create-single-file")]
        public async Task<IActionResult> CreateSingleFile()
        {
            var form = await HttpContext.Request.ReadFormAsync();

            if (form.Files.Count == 0)
            {
                return BadRequest(new { message = "No file uploaded." });
            }

            var file = form.Files[0];
            string? uploadedUrl = null;

            try
            {
                if (file.ContentType.StartsWith("image"))
                {
                    uploadedUrl = await _studentService.UploadProfilePictureAsync(file);
                }
                else if (file.ContentType == "application/pdf")
                {
                    //uploadedUrl = await _studentService.UploadCVAsync(file);
                }

                if (string.IsNullOrEmpty(uploadedUrl))
                {
                    return BadRequest(new { message = "File upload failed. Please try again." });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred during file upload.", error = ex.Message });
            }

            return Ok(new { message = "File uploaded successfully.", url = uploadedUrl });
        }

        [Authorize(Roles = "Employer")]
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusDto dto)
        {
            var result = await _studentService.UpdateStatusAsync(id, dto.Status);
            if (!result) return NotFound();
            return Ok(new { message = "Cập nhật trạng thái thành công." });
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

        [HttpGet("{id}")]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetById(int id)
        {
            var student = await _studentService.GetByIdAsync(id);
            if (student == null)
            {
                return NotFound(new { message = "Không tìm thấy sinh viên với ID này." });
            }
            return Ok(student);
        }
    }
}
