using System;
using AutoMapper;
using InternHub.DTOs.Employer;
using InternHub.Models;
using InternHub.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace InternHub.Services
{
    public class EmployerService : IEmployerService
	{
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

		public EmployerService(AppDbContext context, IMapper mapper)
		{
			_context = context;
			_mapper = mapper;
		}

        public async Task<List<EmployerDto>> GetAllAsync(bool isAdmin = false)
		{
            if (!isAdmin) return new List<EmployerDto>();
			var employers = await _context.Employers.ToListAsync();
			return _mapper.Map<List<EmployerDto>>(employers);
		}

		public async Task<EmployerDto?> GetByUserIdAsync(string userId)
		{
            var employer = await _context.Employers.FirstOrDefaultAsync(e => e.UserId == userId);
            return employer == null ? null : _mapper.Map<EmployerDto>(employer);
        }

        public async Task<EmployerDto?> GetByIdAsync(int id)
        {
            var employer = await _context.Employers.FindAsync(id);
            return employer == null ? null : _mapper.Map<EmployerDto>(employer);
        }

        public async Task<EmployerDto> CreateAsync(CreateEmployer dto, string userId, IWebHostEnvironment env)
		{
			var employer = _mapper.Map<Employer>(dto);
            employer.UserId = userId;
            string webRootPath = env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

            if (dto.CompanyLogo != null && dto.CompanyLogo.ContentType.StartsWith("image"))
            {
                string imagePath = Path.Combine("uploads", "images", Guid.NewGuid() + Path.GetExtension(dto.CompanyLogo.FileName));
                string fullImagePath = Path.Combine(webRootPath, imagePath);
                Directory.CreateDirectory(Path.GetDirectoryName(fullImagePath)!);
                using var stream = new FileStream(fullImagePath, FileMode.Create);
                await dto.CompanyLogo.CopyToAsync(stream);
                employer.CompanyLogo = imagePath;
            }

			_context.Employers.Add(employer);
			await _context.SaveChangesAsync();

			return _mapper.Map<EmployerDto>(employer);
        }

        public async Task<EmployerDto?> UpdateAsync(int id, UpdateEmployer dto, IWebHostEnvironment env, string userId)
        {
            var employer = await _context.Employers.FindAsync(id);
            if (employer == null || employer.UserId != userId) return null; // không cho cập nhật nếu không đúng chủ sở hữu

            // Cập nhật các trường nếu có
            if (!string.IsNullOrWhiteSpace(dto.CompanyName)) employer.CompanyName = dto.CompanyName;
            if (!string.IsNullOrWhiteSpace(dto.CompanyEmail)) employer.CompanyEmail = dto.CompanyEmail;
            if (!string.IsNullOrWhiteSpace(dto.Phone)) employer.Phone = dto.Phone;
            if (!string.IsNullOrWhiteSpace(dto.CompanyDescription)) employer.CompanyDescription = dto.CompanyDescription;
            if (!string.IsNullOrWhiteSpace(dto.Address)) employer.Address = dto.Address;
            if (!string.IsNullOrWhiteSpace(dto.Website)) employer.Website = dto.Website;
            if (!string.IsNullOrWhiteSpace(dto.Industry)) employer.Industry = dto.Industry;
            if (dto.EmployeeSize.HasValue) employer.EmployeeSize = dto.EmployeeSize.Value;
            if (dto.FoundedYear.HasValue) employer.FoundedYear = dto.FoundedYear.Value;

            // Xử lý logo mới nếu có
            string webRootPath = env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            if (dto.CompanyLogo != null && dto.CompanyLogo.ContentType.StartsWith("image"))
            {
                string imagePath = Path.Combine("uploads", "images", Guid.NewGuid() + Path.GetExtension(dto.CompanyLogo.FileName));
                string fullImagePath = Path.Combine(webRootPath, imagePath);
                Directory.CreateDirectory(Path.GetDirectoryName(fullImagePath)!);
                using var stream = new FileStream(fullImagePath, FileMode.Create);
                await dto.CompanyLogo.CopyToAsync(stream);
                employer.CompanyLogo = imagePath;
            }

            await _context.SaveChangesAsync();
            return _mapper.Map<EmployerDto>(employer);
        }


        public async Task<bool> DeleteAsync(int id, string userId)
        {
            var employer = await _context.Employers.FindAsync(id);
            if (employer == null || employer.UserId != userId) return false;

            _context.Employers.Remove(employer);
            await _context.SaveChangesAsync();
            return true;
        }

    }
}

