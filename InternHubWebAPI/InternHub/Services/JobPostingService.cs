using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using InternHub.Models;
using InternHub.Models.Enums;
using InternHub.DTOs.JobPosting;
using InternHub.Services.Interfaces;
using InternHub.DTOs.Common;

namespace InternHub.Services
{
    public class JobPostingService : IJobPostingService
    {
        private readonly AppDbContext _context;

        public JobPostingService(AppDbContext context)
        {
            _context = context;
        }

        // CREATE - Tạo JobPosting mới (EmployerId được truyền từ controller)
        public async Task<JobPostingResponseDto> CreateJobPostingAsync(CreateJobPostingDto createDto, int employerId)
        {
            // Kiểm tra ApplicationDeadline phải trong tương lai
            if (createDto.ApplicationDeadline <= DateTime.UtcNow)
            {
                throw new Exception("Thời hạn nộp hồ sơ phải là ngày trong tương lai");
            }

            // Lấy thông tin Employer từ EmployerId (đã được lấy từ token)
            var employer = await _context.Set<Employer>()
                .FirstOrDefaultAsync(e => e.EmployerId == employerId);

            if (employer == null)
            {
                throw new Exception($"Không tìm thấy Employer với ID: {employerId}");
            }

            // Tạo JobPosting mới với trạng thái mặc định là Pending
            var jobPosting = new JobPosting
            {
                JobTitle = createDto.JobTitle,
                JobDesc = createDto.JobDesc,
                JobCategory = !string.IsNullOrEmpty(createDto.JobCategory) ? createDto.JobCategory : employer.Industry,
                Location = !string.IsNullOrEmpty(createDto.Location) ? createDto.Location : employer.Address,
                Salary = createDto.Salary,
                WorkType = createDto.WorkType,
                ExperienceRequired = createDto.ExperienceRequired,
                SkillsRequired = createDto.SkillsRequired,
                LanguagesRequired = createDto.LanguagesRequired,
                Vacancies = createDto.Vacancies,
                ApplicationDeadline = createDto.ApplicationDeadline,
                PostedAt = DateTime.UtcNow,
                EmployerId = employerId,
                Status = JobpostingStatus.Pending // Mặc định là Pending
            };

            _context.JobPostings.Add(jobPosting);
            await _context.SaveChangesAsync();

            // Trả về DTO với thông tin đầy đủ
            return MapToResponseDto(jobPosting, employer);
        }

        // READ - Đọc JobPosting theo ID (chi tiết)
        public async Task<JobPostingDetailDto> GetJobPostingByIdAsync(int id)
        {
            var jobPosting = await _context.JobPostings
                .Include(j => j.Employer)
                .FirstOrDefaultAsync(j => j.JobPostingId == id);

            if (jobPosting == null)
            {
                return null;
            }

            // Kiểm tra nếu đã hết hạn thì xóa
            if (jobPosting.ApplicationDeadline <= DateTime.UtcNow)
            {
                await DeleteExpiredJobPosting(jobPosting);
                return null;
            }

            return MapToDetailDto(jobPosting, jobPosting.Employer);
        }

        // READ - Lấy thông tin đầy đủ của JobPosting (bao gồm Status và EmployerId)
        public async Task<JobPostingResponseDto> GetFullJobPostingDetailsAsync(int id)
        {
            var jobPosting = await _context.JobPostings
                .Include(j => j.Employer)
                .FirstOrDefaultAsync(j => j.JobPostingId == id);

            if (jobPosting == null)
            {
                return null;
            }

            // Kiểm tra nếu đã hết hạn thì xóa
            if (jobPosting.ApplicationDeadline <= DateTime.UtcNow)
            {
                await DeleteExpiredJobPosting(jobPosting);
                return null;
            }

            return MapToResponseDto(jobPosting, jobPosting.Employer);
        }

        // READ - Lấy tất cả JobPosting theo vai trò
        public async Task<IEnumerable<JobPostingListDto>> GetAllJobPostingsAsync(string userRole = null)
        {
            // Trước tiên, xóa các bài đăng đã hết hạn
            await DeleteAllExpiredJobPostings();

            var query = _context.JobPostings
                .Include(j => j.Employer)
                .AsQueryable();

            // Áp dụng bộ lọc dựa trên vai trò người dùng
            if (userRole == "Admin")
            {
                // Admin xem những bài đăng Pending
                query = query.Where(j => j.Status == JobpostingStatus.Pending);
            }
            else if (userRole == "Student" || userRole == null)
            {
                // Student và người không đăng nhập chỉ xem các bài đăng đã được chấp nhận
                query = query.Where(j => j.Status == JobpostingStatus.Accept);
            }
            // Employer đã được xử lý trong phương thức GetEmployerJobPostingsAsync

            var jobPostings = await query.ToListAsync();
            return jobPostings.Select(j => MapToListDto(j, j.Employer));
        }

        // READ - Lấy JobPosting theo filter
        public async Task<IEnumerable<JobPostingListDto>> GetFilteredJobPostingsAsync(string category, string location, string workType)
        {
            // Trước tiên, xóa các bài đăng đã hết hạn
            await DeleteAllExpiredJobPostings();

            var query = _context.JobPostings
                .Include(j => j.Employer)
                .Where(j => j.Status == JobpostingStatus.Accept) // Chỉ lấy những bài đăng đã được chấp nhận
                .AsQueryable();

            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(j => j.JobCategory.Contains(category));
            }

            if (!string.IsNullOrEmpty(location))
            {
                query = query.Where(j => j.Location.Contains(location));
            }

            if (!string.IsNullOrEmpty(workType))
            {
                query = query.Where(j => j.WorkType.Contains(workType));
            }

            var jobPostings = await query.ToListAsync();
            return jobPostings.Select(j => MapToListDto(j, j.Employer));
        }

        // READ - Admin lấy JobPosting có status Pending
        public async Task<IEnumerable<JobPostingResponseDto>> GetPendingJobPostingsAsync()
        {
            // Trước tiên, xóa các bài đăng đã hết hạn
            await DeleteAllExpiredJobPostings();

            var pendingJobPostings = await _context.JobPostings
                .Include(j => j.Employer)
                .Where(j => j.Status == JobpostingStatus.Pending)
                .ToListAsync();

            return pendingJobPostings.Select(j => MapToResponseDto(j, j.Employer));
        }

        // READ - Employer lấy JobPosting của họ
        public async Task<IEnumerable<JobPostingResponseDto>> GetEmployerJobPostingsAsync(int employerId)
        {
            // Trước tiên, xóa các bài đăng đã hết hạn
            await DeleteAllExpiredJobPostings();

            var employerJobPostings = await _context.JobPostings
                .Include(j => j.Employer)
                .Where(j => j.EmployerId == employerId)
                .ToListAsync();

            return employerJobPostings.Select(j => MapToResponseDto(j, j.Employer));
        }

        // UPDATE - Cập nhật JobPosting
        public async Task<JobPostingResponseDto> UpdateJobPostingAsync(int id, UpdateJobPostingDto updateDto, int employerId)
        {
            var jobPosting = await _context.JobPostings
                .Include(j => j.Employer)
                .FirstOrDefaultAsync(j => j.JobPostingId == id);

            if (jobPosting == null || jobPosting.EmployerId != employerId)
            {
                return null; // Không tìm thấy hoặc không có quyền cập nhật
            }

            // Kiểm tra nếu đã hết hạn thì xóa
            if (jobPosting.ApplicationDeadline <= DateTime.UtcNow)
            {
                await DeleteExpiredJobPosting(jobPosting);
                return null;
            }

            // Kiểm tra ApplicationDeadline phải trong tương lai
            if (updateDto.ApplicationDeadline <= DateTime.UtcNow)
            {
                throw new Exception("Thời hạn nộp hồ sơ phải là ngày trong tương lai");
            }

            // Cập nhật thông tin JobPosting
            if (!string.IsNullOrEmpty(updateDto.JobTitle)) jobPosting.JobTitle = updateDto.JobTitle;
            if (!string.IsNullOrEmpty(updateDto.JobDesc)) jobPosting.JobDesc = updateDto.JobDesc;
            if (!string.IsNullOrEmpty(updateDto.JobCategory)) jobPosting.JobCategory = updateDto.JobCategory;
            if (!string.IsNullOrEmpty(updateDto.Location)) jobPosting.Location = updateDto.Location;
            if (!string.IsNullOrEmpty(updateDto.Salary)) jobPosting.Salary = updateDto.Salary;
            if (!string.IsNullOrEmpty(updateDto.WorkType)) jobPosting.WorkType = updateDto.WorkType;
            if (!string.IsNullOrEmpty(updateDto.ExperienceRequired)) jobPosting.ExperienceRequired = updateDto.ExperienceRequired;
            if (!string.IsNullOrEmpty(updateDto.SkillsRequired)) jobPosting.SkillsRequired = updateDto.SkillsRequired;
            if (!string.IsNullOrEmpty(updateDto.LanguagesRequired)) jobPosting.LanguagesRequired = updateDto.LanguagesRequired;
            jobPosting.ApplicationDeadline = updateDto.ApplicationDeadline;
            if (updateDto.Vacancies > 0) jobPosting.Vacancies = updateDto.Vacancies;

            // Sau khi cập nhật, đặt lại trạng thái là Pending để chờ duyệt
            jobPosting.Status = JobpostingStatus.Pending;

            _context.JobPostings.Update(jobPosting);
            await _context.SaveChangesAsync();

            return MapToResponseDto(jobPosting, jobPosting.Employer);
        }

        // UPDATE - Admin cập nhật trạng thái JobPosting
        public async Task<JobPostingResponseDto> UpdateJobPostingStatusAsync(int id, JobpostingStatus? status)
        {
            var jobPosting = await _context.JobPostings
                .Include(j => j.Employer)
                .FirstOrDefaultAsync(j => j.JobPostingId == id);

            if (jobPosting == null)
            {
                return null;
            }

            // Kiểm tra nếu đã hết hạn thì xóa
            if (jobPosting.ApplicationDeadline <= DateTime.UtcNow)
            {
                await DeleteExpiredJobPosting(jobPosting);
                return null;
            }

            // Cập nhật trạng thái
            jobPosting.Status = status;
            _context.JobPostings.Update(jobPosting);
            await _context.SaveChangesAsync();

            return MapToResponseDto(jobPosting, jobPosting.Employer);
        }

        // DELETE - Xóa JobPosting
        public async Task<bool> DeleteJobPostingAsync(int id, int employerId)
        {
            var jobPosting = await _context.JobPostings.FindAsync(id);
            if (jobPosting == null || jobPosting.EmployerId != employerId)
            {
                return false; // Không tìm thấy hoặc không có quyền xóa
            }

            _context.JobPostings.Remove(jobPosting);
            await _context.SaveChangesAsync();
            return true;
        }

        // Helper methods - Các phương thức mapping DTO

        // Map to List DTO (Hiển thị dạng danh sách - Hình 1)
        private JobPostingListDto MapToListDto(JobPosting jobPosting, Employer employer)
        {
            return new JobPostingListDto
            {
                JobPostingId = jobPosting.JobPostingId,
                JobTitle = jobPosting.JobTitle,
                WorkType = jobPosting.WorkType,
                CompanyName = employer?.CompanyName,
                CompanyLogo = employer?.CompanyLogo,
                Location = jobPosting.Location,
                Vacancies = jobPosting.Vacancies,
                ApplicationDeadline = jobPosting.ApplicationDeadline,
                PostedAt = jobPosting.PostedAt
            };
        }

        // Map to Detail DTO (Hiển thị chi tiết - Hình 2)
        private JobPostingDetailDto MapToDetailDto(JobPosting jobPosting, Employer employer)
        {
            return new JobPostingDetailDto
            {
                JobPostingId = jobPosting.JobPostingId,
                JobTitle = jobPosting.JobTitle,
                JobDesc = jobPosting.JobDesc,
                JobCategory = jobPosting.JobCategory,
                Location = jobPosting.Location,
                Salary = jobPosting.Salary,
                WorkType = jobPosting.WorkType,
                ExperienceRequired = jobPosting.ExperienceRequired,
                SkillsRequired = jobPosting.SkillsRequired,
                LanguagesRequired = jobPosting.LanguagesRequired,
                Vacancies = jobPosting.Vacancies,
                ApplicationDeadline = jobPosting.ApplicationDeadline,
                PostedAt = jobPosting.PostedAt,
                EmployerId = (int)(employer?.EmployerId),
                CompanyName = employer?.CompanyName,
                CompanyLogo = employer?.CompanyLogo,
                Address = employer?.Address,
                Industry = employer?.Industry
            };
        }
        //Filter cho jobposting
        public async Task<PagedResult<JobPostingListDto>> GetFilteredPagedJobPostingsAsync(
            string? searchTerm = null,
            string? workType = null,
            string? location = null,
            string? jobCategory = null,
            string? sortDirection = "desc", // Mặc định là mới nhất -> cũ nhất
            int pageNumber = 1,
            int pageSize = 8)
        {
            // Xóa các bài đăng đã hết hạn
            await DeleteAllExpiredJobPostings();

            var query = _context.JobPostings
                .Include(j => j.Employer)
                .Where(j => j.Status == JobpostingStatus.Accept)
                .AsQueryable();

            // Áp dụng tìm kiếm theo searchTerm (JobTitle hoặc CompanyName)
            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(j => j.JobTitle.Contains(searchTerm) ||
                                        j.Employer.CompanyName.Contains(searchTerm));
            }

            // Áp dụng lọc theo workType (Full-time, Part-time)
            if (!string.IsNullOrEmpty(workType))
            {
                query = query.Where(j => j.WorkType == workType);
            }

            // Áp dụng lọc theo location (Đà Nẵng, Huế, Hà Nội)
            if (!string.IsNullOrEmpty(location))
            {
                query = query.Where(j => j.Location.Contains(location));
            }

            // Áp dụng lọc theo jobCategory (Flutter, ReactJS, Full-stack)
            if (!string.IsNullOrEmpty(jobCategory))
            {
                query = query.Where(j => j.JobCategory == jobCategory);
            }

            // Sắp xếp theo ngày đăng
            query = sortDirection.ToLower() == "asc"
                ? query.OrderBy(j => j.PostedAt)     // Cũ nhất -> Mới nhất
                : query.OrderByDescending(j => j.PostedAt);  // Mới nhất -> Cũ nhất

            // Đếm tổng số items
            var totalItems = await query.CountAsync();

            // Lấy items cho trang hiện tại
            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(j => MapToListDto(j, j.Employer))
                .ToListAsync();

            // Trả về kết quả phân trang
            return new PagedResult<JobPostingListDto>
            {
                Items = items,
                TotalItems = totalItems,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }
        public async Task<IEnumerable<JobPostingListDto>> GetEmployerJobPostingsListAsync(int employerId)
        {
            // Trước tiên, xóa các bài đăng đã hết hạn
            await DeleteAllExpiredJobPostings();

            var employerJobPostings = await _context.JobPostings
                .Include(j => j.Employer)
                .Where(j => j.EmployerId == employerId && j.Status == JobpostingStatus.Accept)
                .ToListAsync();

            // Return only the data needed for the list view (card format)
            return employerJobPostings.Select(j => MapToListDto(j, j.Employer));
        }

        // Map to Response DTO (Đầy đủ thông tin bao gồm status và employerID - cho Admin và Employer)
        private JobPostingResponseDto MapToResponseDto(JobPosting jobPosting, Employer employer)
        {
            return new JobPostingResponseDto
            {
                JobPostingId = jobPosting.JobPostingId,
                JobTitle = jobPosting.JobTitle,
                JobDesc = jobPosting.JobDesc,
                JobCategory = jobPosting.JobCategory,
                Location = jobPosting.Location,
                Salary = jobPosting.Salary,
                WorkType = jobPosting.WorkType,
                ExperienceRequired = jobPosting.ExperienceRequired,
                SkillsRequired = jobPosting.SkillsRequired,
                LanguagesRequired = jobPosting.LanguagesRequired,
                Vacancies = jobPosting.Vacancies,
                ApplicationDeadline = jobPosting.ApplicationDeadline,
                PostedAt = jobPosting.PostedAt,
                EmployerId = jobPosting.EmployerId,
                CompanyName = employer?.CompanyName,
                CompanyLogo = employer?.CompanyLogo,
                Address = employer?.Address,
                Industry = employer?.Industry,
                Status = jobPosting.Status
            };
        }

        // Xóa một bài đăng đã hết hạn
        private async Task DeleteExpiredJobPosting(JobPosting jobPosting)
        {
            _context.JobPostings.Remove(jobPosting);
            await _context.SaveChangesAsync();
        }

        // Xóa tất cả các bài đăng đã hết hạn
        private async Task DeleteAllExpiredJobPostings()
        {
            var now = DateTime.UtcNow;
            var expiredJobs = await _context.JobPostings
                .Where(j => j.ApplicationDeadline <= now)
                .ToListAsync();

            if (expiredJobs.Any())
            {
                _context.JobPostings.RemoveRange(expiredJobs);
                await _context.SaveChangesAsync();
            }
        }
    }
}