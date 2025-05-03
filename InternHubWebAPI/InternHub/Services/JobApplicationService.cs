using System;
using InternHub.DTOs.Review;
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
        public class ResultDto
        {
            public string Status { get; set; } 
            public string Message { get; set; }
        }

        public async Task<ResultDto> ApplyAsync(string userId, ApplicationCreateDto dto)
        {
            try
            {
                var student = await _context.Students.FirstOrDefaultAsync(s => s.UserId == userId);
                if (student == null)
                    return new ResultDto { Status = "fail", Message = "Không tìm thấy sinh viên." };

                if (student.Status == StudentStatus.Internship || student.Status == StudentStatus.Completed)
                    return new ResultDto { Status = "fail", Message = "Bạn không thể ứng tuyển vì đã có trạng thái Internship hoặc Completed." };

                var job = await _context.JobPostings.FindAsync(dto.JobPostingId);
                if (job == null)
                    return new ResultDto { Status = "fail", Message = "Tin tuyển dụng không tồn tại." };

                bool alreadyApplied = await _context.Applications
                    .AnyAsync(a => a.StudentId == student.Id && a.JobPostingId == dto.JobPostingId);
                if (alreadyApplied)
                    return new ResultDto { Status = "fail", Message = "Bạn đã ứng tuyển công việc này ." };

                var application = new Application
                {
                    StudentId = student.Id,
                    JobPostingId = dto.JobPostingId,
                    Status = "pending",
                    ApplicationDate = DateTime.UtcNow,
                };

                _context.Applications.Add(application);
                await _context.SaveChangesAsync();

                return new ResultDto { Status = "success", Message = "Ứng tuyển thành công." };
            }
            catch (Exception ex)
            {
                return new ResultDto { Status = "fail", Message = "Ứng tuyển thất bại: " + ex.Message };
            }
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

        public async Task<bool> UpdateApplicationStatusAsync(int applicationId, StudentStatus newStatus, string employerId)
        {
            // Tìm đơn ứng tuyển theo ID 
            var application = await _context.Applications
                .Include(a => a.Student)
                .Include(a => a.JobPosting)
                .FirstOrDefaultAsync(a => a.ApplicationId == applicationId);

            if (application == null)
                throw new Exception("Application not found");

            var student = application.Student;
            var jobPosting = application.JobPosting;

            // Parse status hiện tại của application
            var isParsed = Enum.TryParse(application.Status, ignoreCase: true, out StudentStatus currentAppStatus);
            if (!isParsed)
                throw new Exception("Invalid current application status");

            // Không cho phép cập nhật xuống trạng thái thấp hơn
            if (newStatus < currentAppStatus)
            {
                throw new Exception($"Không thể cập nhật xuống trạng thái thấp hơn. Trạng thái hiện tại: {currentAppStatus}");
            }

            // Nếu sinh viên đang ở trạng thái Internship
            if (student.Status == StudentStatus.Internship)
            {
                if (!int.TryParse(employerId, out int parsedEmployerId) || jobPosting.EmployerId != parsedEmployerId)
                {
                    throw new Exception("Only the employer who provided the internship can update the student's status.");
                }
            }

            // Nếu application đang ở trạng thái Internship
            if (currentAppStatus == StudentStatus.Internship)
            {
                if (newStatus != StudentStatus.Completed)
                {
                    throw new Exception("Can only update from Internship to Completed status.");
                }
            }

            // Nếu đang cập nhật lên Internship
            if (newStatus == StudentStatus.Internship)
            {
                if (!int.TryParse(employerId, out int parsedEmployerId) || jobPosting.EmployerId != parsedEmployerId)
                {
                    throw new Exception("Only the employer who provided the job posting can update the status to Internship.");
                }

                // Xoá tất cả các đơn ứng tuyển khác (ngoại trừ đơn hiện tại)
                var otherApplications = await _context.Applications
                    .Where(a => a.StudentId == student.Id && a.ApplicationId != applicationId)
                    .ToListAsync();

                _context.Applications.RemoveRange(otherApplications);
                await _context.SaveChangesAsync(); // Xoá trước khi tiếp tục cập nhật
            }

            // Cập nhật status của application
            application.Status = newStatus.ToString();
            _context.Applications.Update(application);
            await _context.SaveChangesAsync();

            // Tìm trạng thái cao nhất trong các application còn lại (có thể chỉ còn 1)
            var allStatuses = await _context.Applications
                .Where(a => a.StudentId == student.Id)
                .Select(a => a.Status)
                .ToListAsync();

            var highestEnumStatus = allStatuses
                .Select(s => Enum.TryParse<StudentStatus>(s, out var parsedStatus) ? parsedStatus : StudentStatus.Pending)
                .Max();

            // Cập nhật student status
            student.Status = highestEnumStatus;
            _context.Students.Update(student);
            await _context.SaveChangesAsync();

            return true;
        }


        public async Task<IEnumerable<StudentViewDto>> GetAllStudentsForAdminAsync()
        {
            var students = await _context.Students
                .OrderByDescending(s => s.CreatedAt)
                .Select(s => new StudentViewDto
                {
                    StudentId = s.Id,
                    GPA = s.GPA.HasValue ? (decimal)s.GPA : 0,
                    StudentName = s.FullName,
                    Status = s.Status.ToString(),
                    CVFile = s.CVFile
                })
                .ToListAsync();
            return students;
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
                    //CVFile = a.Student.CVFile,
                    ApplicationDate = a.ApplicationDate,
                    StudentId = a.StudentId,
                    Status = a.Status
                })
                .ToListAsync();

            return candidates;
        }

        public Task<IEnumerable<StudentViewDto>> GetAllApplicationsForAdminAsync()
        {
            throw new NotImplementedException();
        }
    }
}