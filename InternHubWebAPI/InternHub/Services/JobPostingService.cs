using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using InternHub.Models;
using InternHub.Models.ViewModels;

namespace InternHub.Services
{
    public class JobPostingService : IJobPostingService
    {
        private readonly AppDbContext _context;

        public JobPostingService(AppDbContext context)
        {
            _context = context;
        }

        // CREATE
        public async Task<JobPostingResponseDto> CreateJobPostingAsync(CreateJobPostingDto createDto)
        {
            // Tìm hoặc tạo Employer
            Employer employer;

            if (createDto.EmployerId.HasValue)
            {
                // Sử dụng Employer đã tồn tại
                employer = await _context.Set<Employer>()
                    .FirstOrDefaultAsync(e => e.EmployerId == createDto.EmployerId.Value);

                if (employer == null)
                {
                    throw new Exception($"Không tìm thấy Employer với ID: {createDto.EmployerId}");
                }

                // Cập nhật thông tin Employer nếu cần
                UpdateEmployerInfo(employer, createDto);
            }
            else
            {
                // Kiểm tra xem có Employer với tên công ty này chưa
                employer = await _context.Set<Employer>()
                    .FirstOrDefaultAsync(e => e.CompanyName == createDto.CompanyName);

                if (employer == null)
                {
                    // Tạo Employer mới
                    employer = new Employer
                    {
                        CompanyName = createDto.CompanyName,
                        CompanyLogo = createDto.CompanyLogo,
                        Address = createDto.Address,
                        Industry = createDto.Industry,
                        CreatedAt = DateTime.UtcNow
                    };

                    _context.Set<Employer>().Add(employer);
                    await _context.SaveChangesAsync(); // Lưu để có EmployerId
                }
                else
                {
                    // Cập nhật thông tin Employer hiện có
                    UpdateEmployerInfo(employer, createDto);
                }
            }

            // Tạo JobPosting mới
            var jobPosting = new JobPosting
            {
                JobTitle = createDto.JobTitle,
                JobDesc = createDto.JobDesc,
                JobCategory = createDto.JobCategory ?? createDto.Industry,
                Location = createDto.Location ?? createDto.Address,
                Salary = createDto.Salary,
                WorkType = createDto.WorkType,
                ExperienceRequired = createDto.ExperienceRequired,
                SkillsRequired = createDto.SkillsRequired,
                LanguagesRequired = createDto.LanguagesRequired,
                Vacancies = createDto.Vacancies,
                PostedAt = DateTime.UtcNow,
                EmployerId = employer.EmployerId
            };

            _context.JobPostings.Add(jobPosting);
            await _context.SaveChangesAsync();

            // Trả về DTO với thông tin đầy đủ
            return MapToResponseDto(jobPosting, employer);
        }

        // READ ONE
        public async Task<JobPostingResponseDto> GetJobPostingByIdAsync(int id)
        {
            var jobPosting = await _context.JobPostings
                .Include(j => j.Employer)
                .FirstOrDefaultAsync(j => j.JobPostingId == id);

            if (jobPosting == null)
            {
                return null;
            }

            return MapToResponseDto(jobPosting, jobPosting.Employer);
        }

        // READ ALL
        public async Task<IEnumerable<JobPostingResponseDto>> GetAllJobPostingsAsync()
        {
            var jobPostings = await _context.JobPostings
                .Include(j => j.Employer)
                .ToListAsync();

            return jobPostings.Select(j => MapToResponseDto(j, j.Employer));
        }

        // READ FILTERED
        public async Task<IEnumerable<JobPostingResponseDto>> GetFilteredJobPostingsAsync(string category, string location, string workType)
        {
            var query = _context.JobPostings
                .Include(j => j.Employer)
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
            return jobPostings.Select(j => MapToResponseDto(j, j.Employer));
        }

        // UPDATE
        public async Task<JobPostingResponseDto> UpdateJobPostingAsync(int id, UpdateJobPostingDto updateDto)
        {
            var jobPosting = await _context.JobPostings
                .Include(j => j.Employer)
                .FirstOrDefaultAsync(j => j.JobPostingId == id);

            if (jobPosting == null)
            {
                return null;
            }

            // Cập nhật thông tin JobPosting
            jobPosting.JobTitle = updateDto.JobTitle ?? jobPosting.JobTitle;
            jobPosting.JobDesc = updateDto.JobDesc ?? jobPosting.JobDesc;
            jobPosting.JobCategory = updateDto.JobCategory ?? jobPosting.JobCategory;
            jobPosting.Location = updateDto.Location ?? jobPosting.Location;
            jobPosting.Salary = updateDto.Salary ?? jobPosting.Salary;
            jobPosting.WorkType = updateDto.WorkType ?? jobPosting.WorkType;
            jobPosting.ExperienceRequired = updateDto.ExperienceRequired ?? jobPosting.ExperienceRequired;
            jobPosting.SkillsRequired = updateDto.SkillsRequired ?? jobPosting.SkillsRequired;
            jobPosting.LanguagesRequired = updateDto.LanguagesRequired ?? jobPosting.LanguagesRequired;
            jobPosting.Vacancies = updateDto.Vacancies > 0 ? updateDto.Vacancies : jobPosting.Vacancies;

            // Cập nhật thông tin Employer nếu cần
            var employer = jobPosting.Employer;
            if (employer != null)
            {
                if (!string.IsNullOrEmpty(updateDto.CompanyName))
                    employer.CompanyName = updateDto.CompanyName;
                if (!string.IsNullOrEmpty(updateDto.CompanyLogo))
                    employer.CompanyLogo = updateDto.CompanyLogo;
                if (!string.IsNullOrEmpty(updateDto.Address))
                    employer.Address = updateDto.Address;
                if (!string.IsNullOrEmpty(updateDto.Industry))
                    employer.Industry = updateDto.Industry;

                _context.Set<Employer>().Update(employer);
            }

            _context.JobPostings.Update(jobPosting);
            await _context.SaveChangesAsync();

            return MapToResponseDto(jobPosting, employer);
        }

        // DELETE
        public async Task<bool> DeleteJobPostingAsync(int id)
        {
            var jobPosting = await _context.JobPostings.FindAsync(id);
            if (jobPosting == null)
            {
                return false;
            }

            _context.JobPostings.Remove(jobPosting);
            await _context.SaveChangesAsync();
            return true;
        }

        // Helper methods
        private void UpdateEmployerInfo(Employer employer, JobPostingBaseDto dto)
        {
            // Chỉ cập nhật nếu có giá trị mới và không trống
            if (!string.IsNullOrEmpty(dto.CompanyLogo) && dto.CompanyLogo != employer.CompanyLogo)
                employer.CompanyLogo = dto.CompanyLogo;

            if (!string.IsNullOrEmpty(dto.Address) && dto.Address != employer.Address)
                employer.Address = dto.Address;

            if (!string.IsNullOrEmpty(dto.Industry) && dto.Industry != employer.Industry)
                employer.Industry = dto.Industry;

            _context.Set<Employer>().Update(employer);
        }

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
                PostedAt = jobPosting.PostedAt,
                EmployerId = jobPosting.EmployerId,
                CompanyName = employer?.CompanyName,
                CompanyLogo = employer?.CompanyLogo,
                Address = employer?.Address,
                Industry = employer?.Industry
            };
        }
    }
}