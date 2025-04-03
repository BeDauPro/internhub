using System;
using System.Threading.Tasks;
using InternHub.Contacts;
using InternHub.Models; // Thêm namespace chứa AppDbContext
using Microsoft.AspNetCore.Mvc;

namespace InternHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailController : ControllerBase
    {
        private readonly IEmailSender _emailSender;
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public EmailController(IEmailSender emailSender, AppDbContext context, IConfiguration configuration) 
        {
            _emailSender = emailSender;
            _context = context;
            _configuration = configuration; 
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendEmail([FromBody] EmailRequest request)
        {
            if (string.IsNullOrEmpty(request.Email))
            {
                return BadRequest("Email is required.");
            }

            var verificationLink = $"{_configuration["JWT:EmailVerificationUrl"]}?token={request.Token}"; 
            var message = $"Please verify your email by clicking the link: {verificationLink}";

            await _emailSender.SendEmailAsync(request.Email, "Email Verification", message);
            return Ok("Verification email sent successfully.");
        }
    }

    public class EmailRequest
    {
        public string Email { get; set; }
        public string Token { get; set; } 
    }
}
