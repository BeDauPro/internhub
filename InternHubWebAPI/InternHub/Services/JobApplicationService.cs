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
            //tìm đơn ứng tuyển theo ID 
            var application = await _context.Applications
                .Include(a => a.Student)
                .FirstOrDefaultAsync(a => a.ApplicationId == applicationId);

            if (application == null)
                throw new Exception("Application not found");
            //lấy sinh viên tương ứng với đơn
            var student = application.Student;

            // Nếu sinh viên đã Internship hoặc Completed thì không thay đổi nữa
            if (student.Status == StudentStatus.Internship || student.Status == StudentStatus.Completed)
            {
                // Chỉ cho phép cập nhật nếu chính application đó đã từng là Internship
                if (!Enum.TryParse(application.Status, out StudentStatus applicationStatus) || applicationStatus != StudentStatus.Internship)
                {
                    throw new Exception("Student has already started or completed an internship. Cannot update status anymore.");
                }
                // Cho phép cập nhật nội bộ trong application, không thay đổi status sinh viên
                application.Status = newStatus.ToString();
                await _context.SaveChangesAsync();
                return true;
            }

            // Cập nhật trạng thái mới cho đơn ứng tuyển
            application.Status = newStatus.ToString();
            await _context.SaveChangesAsync();

            // Tìm trạng thái cao nhất từ tất cả đơn ứng tuyển của sinh viên
            var allStatuses = await _context.Applications
                .Where(a => a.StudentId == student.Id)
                .Select(a => a.Status)
                .ToListAsync();

            var highestEnumStatus = allStatuses
                .Select(s => Enum.TryParse<StudentStatus>(s, out var parsedStatus) ? parsedStatus : StudentStatus.Pending)
                .Max();

            // Cập nhật lại trạng thái cho sinh viên nếu chưa từng Internship/Completed
            student.Status = highestEnumStatus;
            _context.Students.Update(student);
            await _context.SaveChangesAsync();

            return true;
        }

        // New method for admin to view all applications
        public async Task<IEnumerable<AdminApplicationViewDto>> GetAllApplicationsForAdminAsync()
        {
            var applications = await _context.Applications
                .Include(a => a.Student)
                .Include(a => a.JobPosting)
                .OrderByDescending(a => a.ApplicationDate)
                .Select(a => new AdminApplicationViewDto
                {
                    StudentId = a.StudentId,
                    JobTitle = a.JobPosting.JobTitle,
                    StudentName = a.Student.FullName,
                    Status = a.Status,
                    CVFile = a.Student.CVFile
                })
                .ToListAsync();

            return applications;
        }

        // New method for employers to view candidates for their job postings
        public async Task<IEnumerable<EmployerCandidateViewDto>> GetCandidatesForEmployerAsync(string userId)
        {
            // First, find the employer ID from the user ID
            var employer = await _context.Employers
                .FirstOrDefaultAsync(e => e.UserId == userId);

            if (employer == null)
                throw new Exception("Không tìm thấy thông tin nhà tuyển dụng.");

            // Get all applications for this employer's job postings
            var candidates = await _context.Applications
                .Include(a => a.Student)
                .Include(a => a.JobPosting)
                .Where(a => a.JobPosting.EmployerId == employer.EmployerId)
                .OrderByDescending(a => a.ApplicationDate)
                .Select(a => new EmployerCandidateViewDto
                {
                    ApplicationId = a.ApplicationId,
                    JobTitle = a.JobPosting.JobTitle,
                    StudentName = a.Student.FullName,
                    CVFile = a.Student.CVFile,
                    ApplicationDate = a.ApplicationDate,
                    Status = a.Status
                })
                .ToListAsync();

            return candidates;
        }
    }
}