using System;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using InternHub.DTOs.Common;
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
        public async Task<PagedResult<EmployerDto>> GetEmployersAsync(string? companyName, string? address, string? sortBy, string? sortDirection, int pageNumber, int pageSize)
        {
            var query = _context.Employers.AsQueryable();

            if (!string.IsNullOrEmpty(companyName))
            {
                query = query.Where(e => e.CompanyName.Contains(companyName));
            }

            if (!string.IsNullOrEmpty(address))
            {
                query = query.Where(e => e.Address.Contains(address));
            }

            // Sorting
            switch (sortBy?.ToLower())
            {
                case "companyname":
                    query = sortDirection == "desc" ? query.OrderByDescending(e => e.CompanyName) : query.OrderBy(e => e.CompanyName);
                    break;
                case "foundedyear":
                    query = sortDirection == "desc" ? query.OrderByDescending(e => e.FoundedYear) : query.OrderBy(e => e.FoundedYear);
                    break;
                case "employeesize":
                    query = sortDirection == "desc" ? query.OrderByDescending(e => e.EmployeeSize) : query.OrderBy(e => e.EmployeeSize);
                    break;
                default:
                    query = query.OrderBy(e => e.EmployerId);
                    break;
            }

            var totalItems = await query.CountAsync();

            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ProjectTo<EmployerDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return new PagedResult<EmployerDto>
            {
                Items = items,
                TotalItems = totalItems,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
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

