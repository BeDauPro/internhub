using AutoMapper;
using InternHub.DTOs.Student;
using InternHub.Models;
using InternHub.Models.Enums;
using InternHub.Models.ViewModels;
using InternHub.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

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

        public async Task<List<StudentDto>> GetAllAsync()
        {
            var students = await _context.Students.ToListAsync();
            return _mapper.Map<List<StudentDto>>(students);
        }

        public async Task<StudentDto> GetByIdAsync(int id)
        {
            var student = await _context.Students.FindAsync(id);
            return student == null ? null : _mapper.Map<StudentDto>(student);
        }

        public async Task<StudentDto> CreateAsync(CreateStudentDto dto, IWebHostEnvironment env)
        {
            var student = _mapper.Map<Student>(dto);

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

        public async Task<StudentDto> UpdateAsync(int id, UpdateStudentDto dto, IWebHostEnvironment env, bool isEmployer)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null) return null;

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

        public async Task<bool> DeleteAsync(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null) return false;

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
