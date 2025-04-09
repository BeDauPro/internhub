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
        [HttpPost]
        public async Task<IActionResult> CreateEmployer([FromBody] EmployerAccountCreateDto createDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!createDto.UserName.EndsWith("company"))
                return BadRequest(new { error = "Username phải kết thúc bằng 'company'" });

            if (createDto.UserName.Contains("Đức"))
                return BadRequest(new { error = "Username không được chứa chữ 'Đức'" });

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
            catch (DbUpdateException dbEx)
            {
                return StatusCode(500, new
                {
                    error = "Lỗi cơ sở dữ liệu",
                    details = GetInnerExceptionMessages(dbEx)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }


        // READ ALL: api/admin/Employer
        [HttpGet]
        public async Task<IActionResult> GetAllEmployers()
        {
            try
            {
                var employers = await _context.Set<Employer>().ToListAsync();
                var result = new List<EmployerAccountResponseDto>();

                foreach (var employer in employers)
                {
                    var user = await _userManager.FindByIdAsync(employer.UserId);
                    if (user != null)
                    {
                        result.Add(new EmployerAccountResponseDto
                        {
                            Id = user.Id,
                            UserName = user.UserName,
                            Email = user.Email,
                            Phone = user.PhoneNumber,
                            CreatedAt = employer.CreatedAt,
                            EmployerId = employer.EmployerId,
                            Role = "Employer"
                        });
                    }
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // READ ONE: api/admin/Employer/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetEmployer(int id)
        {
            try
            {
                var employer = await _context.Set<Employer>()
                    .FirstOrDefaultAsync(e => e.EmployerId == id);

                if (employer == null)
                {
                    return NotFound(new { message = $"Không tìm thấy doanh nghiệp với Id: {id}" });
                }

                var user = await _userManager.FindByIdAsync(employer.UserId);
                if (user == null)
                {
                    return NotFound(new { message = $"Không tìm thấy thông tin người dùng cho doanh nghiệp này" });
                }

                var responseDto = new EmployerAccountResponseDto
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    Email = user.Email,
                    Phone = user.PhoneNumber,
                    CreatedAt = employer.CreatedAt,
                    EmployerId = employer.EmployerId,
                    Role = "Employer"
                };

                return Ok(responseDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // UPDATE: api/admin/Employer/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployer(int id, [FromBody] EmployerAccountCreateDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Kiểm tra thêm về username
            if (!updateDto.UserName.EndsWith("company"))
            {
                ModelState.AddModelError("UserName", "Username phải kết thúc bằng 'company'");
                return BadRequest(ModelState);
            }

            if (updateDto.UserName.Contains("Đức"))
            {
                ModelState.AddModelError("UserName", "Username không được chứa chữ 'Đức'");
                return BadRequest(ModelState);
            }

            if (updateDto.UserName.Contains("\r") || updateDto.UserName.Contains("\n"))
            {
                ModelState.AddModelError("UserName", "Username không được chứa dấu Enter");
                return BadRequest(ModelState);
            }

            try
            {
                var employer = await _context.Set<Employer>()
                    .FirstOrDefaultAsync(e => e.EmployerId == id);

                if (employer == null)
                {
                    return NotFound(new { message = $"Không tìm thấy doanh nghiệp với Id: {id}" });
                }

                var user = await _userManager.FindByIdAsync(employer.UserId);
                if (user == null)
                {
                    return NotFound(new { message = $"Không tìm thấy thông tin người dùng cho doanh nghiệp này" });
                }

                // Kiểm tra username và email không trùng với người dùng khác
                if (user.UserName != updateDto.UserName)
                {
                    var existingUserByUsername = await _userManager.FindByNameAsync(updateDto.UserName);
                    if (existingUserByUsername != null && existingUserByUsername.Id != user.Id)
                    {
                        return BadRequest(new { error = $"Username '{updateDto.UserName}' đã tồn tại!" });
                    }
                    user.UserName = updateDto.UserName;
                }

                if (user.Email != updateDto.Email)
                {
                    var existingUserByEmail = await _userManager.FindByEmailAsync(updateDto.Email);
                    if (existingUserByEmail != null && existingUserByEmail.Id != user.Id)
                    {
                        return BadRequest(new { error = $"Email '{updateDto.Email}' đã tồn tại!" });
                    }
                    user.Email = updateDto.Email;
                }

                using var transaction = await _context.Database.BeginTransactionAsync();

                try
                {
                    // Cập nhật thông tin người dùng
                    user.PhoneNumber = updateDto.Phone;

                    // Cập nhật mật khẩu nếu có
                    if (!string.IsNullOrEmpty(updateDto.Password))
                    {
                        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                        var passwordResult = await _userManager.ResetPasswordAsync(user, token, updateDto.Password);

                        if (!passwordResult.Succeeded)
                        {
                            return BadRequest(new
                            {
                                error = "Không thể cập nhật mật khẩu",
                                details = passwordResult.Errors
                            });
                        }
                    }

                    var updateUserResult = await _userManager.UpdateAsync(user);
                    if (!updateUserResult.Succeeded)
                    {
                        return BadRequest(new
                        {
                            error = "Không thể cập nhật thông tin người dùng",
                            details = updateUserResult.Errors
                        });
                    }

                    // Cập nhật thông tin doanh nghiệp
                    employer.Phone = updateDto.Phone;
                    employer.CompanyName = updateDto.UserName; // Cập nhật tên công ty theo username mới

                    _context.Set<Employer>().Update(employer);
                    await _context.SaveChangesAsync();

                    await transaction.CommitAsync();

                    var responseDto = new EmployerAccountResponseDto
                    {
                        Id = user.Id,
                        UserName = user.UserName,
                        Email = user.Email,
                        Phone = user.PhoneNumber,
                        CreatedAt = employer.CreatedAt,
                        EmployerId = employer.EmployerId,
                        Role = "Employer"
                    };

                    return Ok(responseDto);
                }
                catch (Exception)
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            }
            catch (DbUpdateException dbEx)
            {
                return StatusCode(500, new
                {
                    error = "Lỗi cơ sở dữ liệu",
                    details = GetInnerExceptionMessages(dbEx)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // DELETE: api/admin/Employer/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployer(int id)
        {
            try
            {
                var employer = await _context.Set<Employer>()
                    .Include(e => e.JobPostings)
                    .FirstOrDefaultAsync(e => e.EmployerId == id);

                if (employer == null)
                {
                    return NotFound(new { message = $"Không tìm thấy doanh nghiệp với Id: {id}" });
                }

                // Kiểm tra có JobPosting nào liên quan không
                if (employer.JobPostings != null && employer.JobPostings.Any())
                {
                    return BadRequest(new
                    {
                        error = "Không thể xóa doanh nghiệp vì còn tin tuyển dụng liên quan",
                        jobCount = employer.JobPostings.Count
                    });
                }

                var user = await _userManager.FindByIdAsync(employer.UserId);

                using var transaction = await _context.Database.BeginTransactionAsync();

                try
                {
                    // Xóa Employer trước
                    _context.Set<Employer>().Remove(employer);
                    await _context.SaveChangesAsync();

                    // Xóa User nếu có
                    if (user != null)
                    {
                        var result = await _userManager.DeleteAsync(user);
                        if (!result.Succeeded)
                        {
                            throw new Exception("Đã xóa thông tin công ty nhưng không xóa được tài khoản người dùng");
                        }
                    }

                    await transaction.CommitAsync();
                    return NoContent();
                }
                catch (Exception)
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // Phương thức helper để lấy tất cả thông điệp lỗi từ inner exceptions
        private string GetInnerExceptionMessages(Exception ex)
        {
            var message = ex.Message;
            var innerException = ex.InnerException;

            while (innerException != null)
            {
                message += " -> " + innerException.Message;
                innerException = innerException.InnerException;
            }

            return message;
        }
    }
}