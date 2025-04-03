using InternHub.Contacts;
using InternHub.Models;
using InternHub.Models.ViewModels;
using InternHub.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InternHub.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly AuthService _authService;
        private readonly IEmailSender _emailSender;

        public AuthenticationController(UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration,
            AuthService authService,
            IEmailSender emailSender
            )
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _authService = authService;
            _emailSender = emailSender;
        }

        [HttpPost("register-user")]
        public async Task<IActionResult> Register([FromBody] RegisterViewModel registerVm)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userExists = await _userManager.FindByEmailAsync(registerVm.Email);
            if (userExists != null)
            {
                return BadRequest(new { error = $"User {registerVm.Email} already exists!" });
            }

            var verificationToken = Guid.NewGuid().ToString(); 

            var newUser = new ApplicationUser()
            {
                UserName = registerVm.UserName,
                Email = registerVm.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                VerificationToken = verificationToken 
            };

            var result = await _userManager.CreateAsync(newUser, registerVm.Password);
            if (!result.Succeeded)
            {
                return BadRequest(new { error = "User could not be created!", details = result.Errors });
            }

            var verificationLink = $"{_configuration["JWT:EmailVerificationUrl"]}?token={verificationToken}";
            var message = $"Please verify your email by clicking the link: {verificationLink}";
            await _emailSender.SendEmailAsync(newUser.Email, "Email Verification", message);

            return Ok(new { message = "User registered successfully! Please check your email for the verification link.", userId = newUser.Id });
        }

        [HttpGet("verify-email")]
        public async Task<IActionResult> VerifyEmail(string token)
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.VerificationToken == token);
            if (user == null)
            {
                return BadRequest("Invalid or expired token.");
            }

            user.EmailConfirmed = true;
            user.VerificationToken = null;
            await _userManager.UpdateAsync(user);

            return Ok("Email verified successfully!");
        }

        [HttpPost("login-user")]
        public async Task<IActionResult> Login([FromBody] LoginViewModel payload)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { error = "Please, provide all required fields" });
            }

            var user = await _userManager.FindByEmailAsync(payload.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, payload.Password))
            {
                return Unauthorized(new { error = "Invalid email or password" });
            }

            var roles = await _userManager.GetRolesAsync(user);
            var role = roles.FirstOrDefault() ?? "User";
            var tokenValue = await _authService.GenerateJwtToken(user, role);

            return Ok(new
            {
                token = tokenValue,
                role = roles.FirstOrDefault()
            });
        }
    }
}
