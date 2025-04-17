using System;
using InternHub.Models;
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
    }
}

