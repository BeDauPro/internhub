using System;
using InternHub.Models;
using InternHub.Models.Enums;
using InternHub.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using static InternHub.DTOs.JobApplication.JobApplicationDto;

namespace InternHub.Services
{
    public class JobApplicationService : IJobApplicationService
    {
        private readonly AppDbContext _context;

        public JobApplicationService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<string> ApplyAsync(string userId, ApplicationCreateDto dto)
        {
            var student = await _context.Students.FirstOrDefaultAsync(s => s.UserId == userId);
            if (student == null)
                throw new Exception("Không tìm thấy sinh viên.");

            var job = await _context.JobPostings.FindAsync(dto.JobPostingId);
            if (job == null)
                throw new Exception("Tin tuyển dụng không tồn tại.");

            bool alreadyApplied = await _context.Applications
                .AnyAsync(a => a.StudentId == student.Id && a.JobPostingId == dto.JobPostingId);
            if (alreadyApplied)
                throw new Exception("Bạn đã ứng tuyển công việc này.");

            var application = new Application
            {
                StudentId = student.Id,
                JobPostingId = dto.JobPostingId,
                Status = "pending",
                ApplicationDate = DateTime.UtcNow,
            };

            _context.Applications.Add(application);
            await _context.SaveChangesAsync();

            return "Ứng tuyển thành công.";
        }

        public async Task<IEnumerable<ApplicationViewDto>> GetApplicationsByJobPostingAsync(int jobPostingId)
        {
            var applications = await _context.Applications
                .Where(a => a.JobPostingId == jobPostingId)
                .Include(a => a.Student)
                .Select(a => new ApplicationViewDto
                {
                    ApplicationId = a.ApplicationId,
                    StudentId = a.StudentId,
                    StudentName = a.Student.FullName,
                    StudentEmail = a.Student.SchoolEmail,
                    ApplicationDate = a.ApplicationDate,
                    Status = a.Status
                })
                .ToListAsync();

            return applications;
        }

        public async Task<List<ApplicationHistoryDto>> GetApplicationHistoryByStudentAsync(string userId)
        {
            var student = await _context.Students.FirstOrDefaultAsync(s => s.UserId == userId);
            if (student == null)
                throw new Exception("Student not found");

            var applications = await _context.Applications
                .Where(a => a.StudentId == student.Id)
                .Include(a => a.JobPosting)
                    .ThenInclude(j => j.Employer)
                .OrderByDescending(a => a.ApplicationDate)
                .ToListAsync();

            return applications.Select(a => new ApplicationHistoryDto
            {
                JobPostingId = a.JobPostingId,
                JobTitle = a.JobPosting.JobTitle,
                CompanyName = a.JobPosting.Employer.CompanyName,
                ApplicationDate = a.ApplicationDate,
                Status = a.Status
            }).ToList();
        }

        public async Task<bool> UpdateApplicationStatusAsync(int applicationId, StudentStatus newStatus)
        {
            // Tìm đơn ứng tuyển theo ID 
            var application = await _context.Applications
                .Include(a => a.Student)
                .FirstOrDefaultAsync(a => a.ApplicationId == applicationId);

            if (application == null)
                throw new Exception("Application not found");

            var student = application.Student;

            // Parse status hiện tại của application
            var isParsed = Enum.TryParse(application.Status, out StudentStatus currentAppStatus);

            // Nếu sinh viên đã Internship hoặc Completed
            if (student.Status == StudentStatus.Internship || student.Status == StudentStatus.Completed)
            {
                // Chỉ cho phép cập nhật nếu:
                // - Chính application đó đã từng là Internship
                // - Và trạng thái mới là Completed
                if (!isParsed || currentAppStatus != StudentStatus.Internship || newStatus != StudentStatus.Completed)
                {
                    throw new Exception("Student has already started or completed an internship. Cannot update status anymore.");
                }

                // ✅ Cho phép cập nhật nội bộ application (từ Internship → Completed)
                application.Status = newStatus.ToString();
                student.Status = newStatus; // Update luôn student nếu completed thành công
                _context.Applications.Update(application);
                _context.Students.Update(student);
                await _context.SaveChangesAsync();
                return true;
            }

            // Trường hợp sinh viên chưa Internship → cập nhật bình thường
            application.Status = newStatus.ToString();
            _context.Applications.Update(application);
            await _context.SaveChangesAsync();

            // Tìm trạng thái cao nhất trong các application
            var allStatuses = await _context.Applications
                .Where(a => a.StudentId == student.Id)
                .Select(a => a.Status)
                .ToListAsync();

            var highestEnumStatus = allStatuses
                .Select(s => Enum.TryParse<StudentStatus>(s, out var parsedStatus) ? parsedStatus : StudentStatus.Pending)
                .Max();

            student.Status = highestEnumStatus;
            _context.Students.Update(student);
            await _context.SaveChangesAsync();

            return true;
        }

    }
}

