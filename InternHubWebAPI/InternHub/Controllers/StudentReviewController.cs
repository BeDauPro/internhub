using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using InternHub.DTOs.Review;
using InternHub.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

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
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> CreateReview([FromBody] StudentReviewCreateDto dto)
        {
            try
            {
                var review = await _reviewService.CreateAsync(dto);
                return Ok(review);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("student/{studentId}")]
        public async Task<IActionResult> GetReviewsForStudent(int studentId)
        {
            var reviews = await _reviewService.GetReviewsByStudentIdAsync(studentId);
            return Ok(reviews);
        }
    }

}

