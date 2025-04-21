using InternHub.DTOs.Review;
using InternHub.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InternHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentReviewController : ControllerBase
    {
        private readonly IStudentReviewService _reviewService;

        public StudentReviewController(IStudentReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpPost]
        [Authorize(Roles = "Employer,Student")]
        public async Task<IActionResult> CreateReview([FromBody] StudentReviewCreateDto dto)
        {
            try
            {
                var review = await _reviewService.CreateAsync(dto);
                return Ok(review);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.ToString() }); 
            }
        }

        [HttpGet("student/{studentId}")]
        [Authorize(Roles = "Student,Employer,Admin")]
        public async Task<IActionResult> GetReviewsForStudent(int studentId)
        {
            var reviews = await _reviewService.GetReviewsByStudentIdAsync(studentId);
            return Ok(reviews);
        }

        [HttpGet("employer/{employerId}")]
        [Authorize(Roles = "Student,Employer,Admin")]
        public async Task<IActionResult> GetReviewsForEmployer(int employerId)
        {
            var reviews = await _reviewService.GetReviewsByEmployerIdAsync(employerId);
            return Ok(reviews);
        }
    }
}
