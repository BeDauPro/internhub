using AutoMapper;
using InternHub.DTOs.Student;
using InternHub.Models;
using InternHub.Models.Enums;
using InternHub.Models.ViewModels;
using InternHub.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using InternHub.DTOs.Common;
using AutoMapper.QueryableExtensions;

namespace InternHub.Services
{
    public class StudentService : IStudentService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public StudentService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<PagedResult<StudentDto>> GetStudentsAsync(
           string? fullName,
           string? schoolEmail,
           string? status,
           string? timeFilter,
           string? sortBy,
           string? sortDirection,
           int pageNumber,
           int pageSize)
        {
            var query = _context.Students
                .Include(s => s.Applications) // Thêm Include nếu cần để lấy thông tin ngày nộp đơn
                .AsQueryable();

            // Lọc theo tên
            if (!string.IsNullOrEmpty(fullName))
            {
                query = query.Where(e => e.FullName.Contains(fullName));
            }

            // Lọc theo email
            if (!string.IsNullOrEmpty(schoolEmail))
            {
                query = query.Where(e => e.SchoolEmail.Contains(schoolEmail));
            }

            // Lọc theo status
            if (!string.IsNullOrEmpty(status) && Enum.TryParse<StudentStatus>(status, out var statusEnum))
            {
                query = query.Where(e => e.Status == statusEnum);
            }

            // Lọc theo thời gian nộp đơn
            if (!string.IsNullOrEmpty(timeFilter))
            {
                var today = DateTime.Today;
                switch (timeFilter.ToLower())
                {
                    case "today":
                    case "hôm nay":
                        query = query.Where(s => s.Applications.Any(a => a.ApplicationDate.Date == today));
                        break;

                    case "last7days":
                    case "7 ngày qua":
                        var last7Days = today.AddDays(-7);
                        query = query.Where(s => s.Applications.Any(a => a.ApplicationDate.Date >= last7Days));
                        break;

                    case "last30days":
                    case "30 ngày qua":
                        var last30Days = today.AddDays(-30);
                        query = query.Where(s => s.Applications.Any(a => a.ApplicationDate.Date >= last30Days));
                        break;

                        // Bạn có thể thêm các trường hợp khác nếu cần
                }
            }

            // Sorting
            switch (sortBy?.ToLower())
            {
                case "fullname":
                    query = sortDirection == "desc" ? query.OrderByDescending(e => e.FullName) : query.OrderBy(e => e.FullName);
                    break;
                case "schoolemail":
                    query = sortDirection == "desc" ? query.OrderByDescending(e => e.SchoolEmail) : query.OrderBy(e => e.SchoolEmail);
                    break;
                case "status":
                    query = sortDirection == "desc" ? query.OrderByDescending(e => e.Status) : query.OrderBy(e => e.Status);
                    break;
                case "applieddate":
                    // Sắp xếp theo ngày nộp đơn gần nhất
                    query = sortDirection == "desc"
                        ? query.OrderByDescending(s => s.Applications.Max(a => a.ApplicationDate))
                        : query.OrderBy(s => s.Applications.Min(a => a.ApplicationDate));
                    break;
                default:
                    query = query.OrderBy(e => e.Id);
                    break;
            }

            var totalItems = await query.CountAsync();

            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ProjectTo<StudentDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return new PagedResult<StudentDto>
            {
                Items = items,
                TotalItems = totalItems,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }
        public async Task<List<StudentDto>> GetAllAsync(bool isStudent = false)
        {
            if (!isStudent) return new List<StudentDto>();
            var students = await _context.Students.ToListAsync();
            return _mapper.Map<List<StudentDto>>(students);
        }

        public async Task<StudentDto?> GetByUserIdAsync(string userID)
        {
            var student = await _context.Students.FirstOrDefaultAsync(e => e.UserId == userID);
            return student == null ? null : _mapper.Map<StudentDto>(student);
        }

        public async Task<StudentDto?> GetByIdAsync(int id)
        {
            var student = await _context.Students.FindAsync(id);
            return student == null ? null : _mapper.Map<StudentDto>(student);
        }

        public async Task<StudentDto> CreateAsync(CreateStudentDto dto, string userId, IWebHostEnvironment env)
        {
            var student = _mapper.Map<Student>(dto);
            student.UserId = userId;

            string webRootPath = env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

            if (dto.ProfilePicture != null && dto.ProfilePicture.ContentType.StartsWith("image"))
            {
                string imagePath = Path.Combine("uploads", "images", Guid.NewGuid() + Path.GetExtension(dto.ProfilePicture.FileName));
                string fullImagePath = Path.Combine(webRootPath, imagePath);
                Directory.CreateDirectory(Path.GetDirectoryName(fullImagePath)!);
                using var stream = new FileStream(fullImagePath, FileMode.Create);
                await dto.ProfilePicture.CopyToAsync(stream);
                student.ProfilePicture = imagePath;
            }

            if (dto.CVFile != null && dto.CVFile.ContentType == "application/pdf")
            {
                string cvPath = Path.Combine("uploads", "cv", Guid.NewGuid() + Path.GetExtension(dto.CVFile.FileName));
                string fullCvPath = Path.Combine(webRootPath, cvPath);
                Directory.CreateDirectory(Path.GetDirectoryName(fullCvPath)!);
                using var stream = new FileStream(fullCvPath, FileMode.Create);
                await dto.CVFile.CopyToAsync(stream);
                student.CVFile = cvPath;
            }

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return _mapper.Map<StudentDto>(student);
        }


        public async Task<StudentDto> UpdateAsync(int id, UpdateStudentDto dto, IWebHostEnvironment env, bool isEmployer, string userId)
        {
            var student = await _context.Students.FindAsync(id);

            if (student == null || student.UserId != userId) return null;

            if (isEmployer)
            {
                if (dto.Status != null)
                {
                    student.Status = dto.Status.Value;
                }
            }
            else
            {
                // Chỉ Student mới vào nhánh này
                if (!string.IsNullOrWhiteSpace(dto.FullName)) student.FullName = dto.FullName;
                if (!string.IsNullOrWhiteSpace(dto.SchoolEmail)) student.SchoolEmail = dto.SchoolEmail;
                if (!string.IsNullOrWhiteSpace(dto.Bio)) student.Bio = dto.Bio;
                if (!string.IsNullOrWhiteSpace(dto.Address)) student.Address = dto.Address;
                if (!string.IsNullOrWhiteSpace(dto.GithubProfile)) student.GithubProfile = dto.GithubProfile;
                if (!string.IsNullOrWhiteSpace(dto.Gender)) student.Gender = dto.Gender;
                if (!string.IsNullOrWhiteSpace(dto.Skills)) student.Skills = dto.Skills;
                if (!string.IsNullOrWhiteSpace(dto.Languages)) student.Languages = dto.Languages;
                if (!string.IsNullOrWhiteSpace(dto.UserId)) student.UserId = dto.UserId;
                if (dto.GPA.HasValue) student.GPA = dto.GPA.Value;
                if (dto.DateOfBirth.HasValue) student.DateOfBirth = dto.DateOfBirth.Value;

                string webRootPath = env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

                if (dto.ProfilePicture != null)
                {
                    string imagePath = Path.Combine("uploads", "images", Guid.NewGuid() + Path.GetExtension(dto.ProfilePicture.FileName));
                    string fullImagePath = Path.Combine(webRootPath, imagePath);
                    Directory.CreateDirectory(Path.GetDirectoryName(fullImagePath)!);
                    using var stream = new FileStream(fullImagePath, FileMode.Create);
                    await dto.ProfilePicture.CopyToAsync(stream);
                    student.ProfilePicture = imagePath;
                }

                if (dto.CVFile != null)
                {
                    string cvPath = Path.Combine("uploads", "cv", Guid.NewGuid() + Path.GetExtension(dto.CVFile.FileName));
                    string fullCvPath = Path.Combine(webRootPath, cvPath);
                    Directory.CreateDirectory(Path.GetDirectoryName(fullCvPath)!);
                    using var stream = new FileStream(fullCvPath, FileMode.Create);
                    await dto.CVFile.CopyToAsync(stream);
                    student.CVFile = cvPath;
                }
            }

            await _context.SaveChangesAsync();
            return _mapper.Map<StudentDto>(student);
        }

        public async Task<bool> DeleteAsync(int id, string userId)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null || student.UserId != userId) return false;

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();
            return true;
        }

        public List<string> GetStatuses()
        {
            return Enum.GetNames(typeof(StudentStatus)).ToList();
        }
    }
}
