using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using InternHub.Models;
using System.Text.RegularExpressions;
using InternHub.DTOs.Admin;

namespace InternHub.Controllers
{
    [Route("api/admin/[controller]")]
    [ApiController]
    // Uncomment when ready to enforce authentication
    // [Authorize(Roles = "Admin")]
    public class EmployerAccountController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly AppDbContext _context;

        public EmployerAccountController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            AppDbContext context)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
        }

        // CREATE: api/admin/Employer
   
        [HttpPost]
        public async Task<IActionResult> CreateEmployer([FromBody] EmployerAccountCreateDto createDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!createDto.UserName.EndsWith("company"))
                return BadRequest(new { error = "Username phải kết thúc bằng 'company'" });

            if (createDto.UserName.Contains("\r") || createDto.UserName.Contains("\n"))
                return BadRequest(new { error = "Username không được chứa dấu Enter" });

            try
            {
                var existingUser = await _userManager.FindByNameAsync(createDto.UserName);
                if (existingUser != null)
                    return BadRequest(new { error = $"Username '{createDto.UserName}' đã tồn tại!" });

                var existingEmail = await _userManager.FindByEmailAsync(createDto.Email);
                if (existingEmail != null)
                    return BadRequest(new { error = $"Email '{createDto.Email}' đã tồn tại!" });

                var newUser = new ApplicationUser
                {
                    UserName = createDto.UserName,
                    Email = createDto.Email,
                    PhoneNumber = createDto.Phone,
                    EmailConfirmed = true,
                    SecurityStamp = Guid.NewGuid().ToString()
                };

                var result = await _userManager.CreateAsync(newUser, createDto.Password);
                if (!result.Succeeded)
                {
                    return BadRequest(new
                    {
                        error = "Không thể tạo tài khoản người dùng",
                        details = result.Errors
                    });
                }

                await _userManager.AddToRoleAsync(newUser, "Employer");

                // Không tạo Employer ở đây

                var responseDto = new
                {
                    Id = newUser.Id,
                    UserName = newUser.UserName,
                    Email = newUser.Email,
                    Phone = newUser.PhoneNumber,
                    Role = "Employer"
                };

                return Ok(responseDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }


        // READ ALL: api/admin/Employer
        [HttpGet]
        public async Task<IActionResult> GetAllEmployers([FromQuery] int? hours = null, [FromQuery] int? count = 50)
        {
            try
            {
                // Lấy roleId của role "Employer"
                var employerRole = await _roleManager.FindByNameAsync("Employer");
                if (employerRole == null)
                {
                    return BadRequest(new { error = "Role 'Employer' không tồn tại" });
                }

                // Join bảng AspNetUsers và AspNetUserRoles để lấy các user có role là "Employer"
                var query = from user in _context.Users
                            join userRole in _context.UserRoles on user.Id equals userRole.UserId
                            where userRole.RoleId == employerRole.Id
                            orderby user.CreatedAt descending
                            select new EmployerAccountResponseDto
                            {
                                Id = user.Id,
                                UserName = user.UserName,
                                Email = user.Email,
                                Phone = user.PhoneNumber,
                                CreatedAt = user.CreatedAt,
                                Role = "Employer"
                            };

                // Nếu cần lọc theo thời gian tạo gần đây
                if (hours.HasValue)
                {
                    var cutoffTime = DateTime.UtcNow.AddHours(-hours.Value);
                    query = query.Where(r => r.CreatedAt >= cutoffTime);
                }

                // Giới hạn số lượng bản ghi
                var result = await query.Take(count.Value).ToListAsync();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message, stackTrace = ex.StackTrace });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployer(string id)
        {
            try
            {
                // Kiểm tra id truyền vào
                if (string.IsNullOrEmpty(id))
                {
                    return BadRequest(new { error = "ID không hợp lệ" });
                }

                // Tìm user dựa trên userId
                var user = await _userManager.FindByIdAsync(id);
                if (user == null)
                {
                    return NotFound(new { message = $"Không tìm thấy người dùng với Id: {id}" });
                }

                // Xóa User mà không cần kiểm tra thêm điều kiện gì
                var result = await _userManager.DeleteAsync(user);
                if (!result.Succeeded)
                {
                    return StatusCode(500, new
                    {
                        error = "Không thể xóa tài khoản",
                        details = result.Errors.Select(e => e.Description)
                    });
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}