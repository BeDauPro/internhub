using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InternHub.Models;
using InternHub.Models.ViewModels;
using InternHub.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace InternHub.Controllers
{
    public class AuthenticationController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly AuthService _authService;

        public AuthenticationController(UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager,
        AppDbContext context,
        IConfiguration configuration,
        AuthService authService)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
            _configuration = configuration;
            _authService = authService;
        }
        [HttpPost("register-user")]
        public async Task<IActionResult> Register([FromBody] RegisterViewModel registerVm)
        {
            var userExists = await _userManager.FindByEmailAsync(registerVm.Email);
            if (userExists != null)
            {
                return BadRequest($"User {registerVm.Email} already exists!");
            }
            var newUser = new ApplicationUser()
            {
                UserName = registerVm.UserName,
                Email = registerVm.Email,
                Custom = registerVm.UserName,
                SecurityStamp = new Guid().ToString()
            };
            var result = await _userManager.CreateAsync(newUser, registerVm.Password);
            if (!result.Succeeded)
            {
                return BadRequest("User could not be create!");
            }
            return Created(nameof(Register), $"User {registerVm.Email} created!");
        }

        [HttpPost("login-user")]
        public async Task<IActionResult> Login([FromBody] LoginViewModel payload)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Please, provide all required fields");
            }
            var user = await _userManager.FindByEmailAsync(payload.Email);
            if (user != null && await _userManager.CheckPasswordAsync(user, payload.Password))
            {
                var tokenValue = await _authService.GenerateJwtToken(user);
                return Ok(tokenValue);
            }
            return Unauthorized();
        }

    }
}

