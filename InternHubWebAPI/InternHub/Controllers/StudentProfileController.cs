using InternHub.DTOs.Student;
using InternHub.Services.Interfaces;
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

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var students = await _studentService.GetAllAsync();
            return Ok(students);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var student = await _studentService.GetByIdAsync(id);
            return student == null ? NotFound() : Ok(student);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] CreateStudentDto dto)
        {
            var created = await _studentService.CreateAsync(dto, _env);
            return Ok(created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] UpdateStudentDto dto)
        {
            var updated = await _studentService.UpdateAsync(id, dto, _env);
            return updated == null ? NotFound() : Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _studentService.DeleteAsync(id);
            return deleted ? NoContent() : NotFound();
        }

        [HttpGet("statuses")]
        public IActionResult GetStatuses()
        {
            var statuses = _studentService.GetStatuses();
            return Ok(statuses);
        }
    }
}
