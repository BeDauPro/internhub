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
using System.IO;

namespace InternHub.Services
{
    public class StudentService : IStudentService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly AzureBlobService _blobService;

        public StudentService(AppDbContext context, IMapper mapper, AzureBlobService blobService)
        {
            _context = context;
            _mapper = mapper;
            _blobService = blobService;
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
                .Include(s => s.Applications)
                .AsQueryable();

            if (!string.IsNullOrEmpty(fullName))
            {
                query = query.Where(e => e.FullName.Contains(fullName));
            }

            if (!string.IsNullOrEmpty(schoolEmail))
            {
                query = query.Where(e => e.SchoolEmail.Contains(schoolEmail));
            }

            if (!string.IsNullOrEmpty(status) && Enum.TryParse<StudentStatus>(status, out var statusEnum))
            {
                query = query.Where(e => e.Status == statusEnum);
            }

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
                }
            }

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

        public async Task<string?> UploadProfilePictureAsync(IFormFile file)
        {
            if (file != null && file.ContentType.StartsWith("image"))
            {
                var uploadedUrl = await _blobService.UploadFileAsync(file);
                if (string.IsNullOrEmpty(uploadedUrl))
                {
                    throw new Exception("Failed to upload profile picture.");
                }
                Console.WriteLine(uploadedUrl);
                return uploadedUrl;
            }
            return null;
        }

        public async Task<string?> UploadCVAsync(IFormFile file)
        {
            if (file != null && file.ContentType == "application/pdf")
            {
                var uploadedUrl = await _blobService.UploadFileAsync(file);
                if (string.IsNullOrEmpty(uploadedUrl))
                {
                    throw new Exception("Failed to upload CV.");
                }
                return uploadedUrl;
            }
            return null;
        }

        public async Task<StudentDto> CreateAsync(CreateStudentDto dto, string userId, IWebHostEnvironment env)
        {
            var student = _mapper.Map<Student>(dto);
            student.UserId = userId;

            student.ProfilePicture = await UploadProfilePictureAsync(dto.ProfilePicture);
            student.CVFile = await UploadCVAsync(dto.CVFile);

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return _mapper.Map<StudentDto>(student);
        }

        public async Task<StudentDto> UpdateAsync(int id, UpdateStudentDto dto, IWebHostEnvironment env, string userId)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null || student.UserId != userId) return null;

            if (!string.IsNullOrWhiteSpace(dto.FullName)) student.FullName = dto.FullName;
            if (!string.IsNullOrWhiteSpace(dto.SchoolEmail)) student.SchoolEmail = dto.SchoolEmail;
            if (!string.IsNullOrWhiteSpace(dto.Bio)) student.Bio = dto.Bio;
            if (!string.IsNullOrWhiteSpace(dto.Address)) student.Address = dto.Address;
            if (!string.IsNullOrWhiteSpace(dto.GithubProfile)) student.GithubProfile = dto.GithubProfile;
            if (!string.IsNullOrWhiteSpace(dto.Gender)) student.Gender = dto.Gender;
            if (!string.IsNullOrWhiteSpace(dto.Skills)) student.Skills = dto.Skills;
            if (!string.IsNullOrWhiteSpace(dto.Languages)) student.Languages = dto.Languages;
            if (dto.GPA.HasValue) student.GPA = dto.GPA.Value;
            if (dto.DateOfBirth.HasValue) student.DateOfBirth = dto.DateOfBirth.Value;
            if (!string.IsNullOrWhiteSpace(dto.Education)) student.Education = dto.Education;
            if (!string.IsNullOrWhiteSpace(dto.Phone)) student.Phone = dto.Phone;
            if (!string.IsNullOrWhiteSpace(dto.ProfilePicture)) student.ProfilePicture = dto.ProfilePicture;
            

            if (dto.CVFile != null && dto.CVFile.Length > 0)
            {
                if (!string.IsNullOrEmpty(student.CVFile))
                {
                    await _blobService.DeleteFileIfExistsAsync(student.CVFile);
                }
                var newCV = await UploadCVAsync(dto.CVFile);
                if (!string.IsNullOrEmpty(newCV))
                    student.CVFile = newCV;
            }

            await _context.SaveChangesAsync();
            return _mapper.Map<StudentDto>(student);
        }

        public async Task<bool> UpdateStatusAsync(int studentId, StudentStatus status)
        {
            var student = await _context.Students.FindAsync(studentId);
            if (student == null) return false;

            student.Status = status;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id, string userId)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null || student.UserId != userId) return false;

            if (!string.IsNullOrEmpty(student.ProfilePicture))
                await _blobService.DeleteFileIfExistsAsync(student.ProfilePicture);
            if (!string.IsNullOrEmpty(student.CVFile))
                await _blobService.DeleteFileIfExistsAsync(student.CVFile);

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