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
        private readonly AzureBlobService _blobService;

        public EmployerService(AppDbContext context, IMapper mapper, AzureBlobService blobService)
        {
            _context = context;
            _mapper = mapper;
            _blobService = blobService;
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

        public async Task<string?> UploadCompanyLogoAsync(IFormFile file)
        {
            if (file != null && file.ContentType.StartsWith("image"))
            {
                var uploadedUrl = await _blobService.UploadFileAsync(file);
                if (string.IsNullOrEmpty(uploadedUrl))
                {
                    throw new Exception("Failed to upload company logo.");
                }
                return uploadedUrl;
            }
            return null;
        }

        public async Task<EmployerDto> CreateAsync(CreateEmployer dto, string userId, IWebHostEnvironment env)
        {
            var employer = _mapper.Map<Employer>(dto);
            employer.UserId = userId;

            if (dto.CompanyLogo != null && dto.CompanyLogo.ContentType.StartsWith("image"))
            {
                employer.CompanyLogo = await UploadCompanyLogoAsync(dto.CompanyLogo);
            }

            _context.Employers.Add(employer);
            await _context.SaveChangesAsync();

            return _mapper.Map<EmployerDto>(employer);
        }

        public async Task<EmployerDto?> UpdateAsync(int id, UpdateEmployer dto, IWebHostEnvironment env, string userId)
        {
            var employer = await _context.Employers.FindAsync(id);
            if (employer == null || employer.UserId != userId) return null;

            // Update fields if provided
            if (!string.IsNullOrWhiteSpace(dto.CompanyName)) employer.CompanyName = dto.CompanyName;
            if (!string.IsNullOrWhiteSpace(dto.CompanyEmail)) employer.CompanyEmail = dto.CompanyEmail;
            if (!string.IsNullOrWhiteSpace(dto.Phone)) employer.Phone = dto.Phone;
            if (!string.IsNullOrWhiteSpace(dto.CompanyDescription)) employer.CompanyDescription = dto.CompanyDescription;
            if (!string.IsNullOrWhiteSpace(dto.Address)) employer.Address = dto.Address;
            if (!string.IsNullOrWhiteSpace(dto.Website)) employer.Website = dto.Website;
            if (!string.IsNullOrWhiteSpace(dto.Industry)) employer.Industry = dto.Industry;
            if (dto.EmployeeSize.HasValue) employer.EmployeeSize = dto.EmployeeSize.Value;
            if (dto.FoundedYear.HasValue) employer.FoundedYear = dto.FoundedYear.Value;

            // Handle new logo if provided
            if (dto.CompanyLogo != null && dto.CompanyLogo.ContentType.StartsWith("image"))
            {
                if (!string.IsNullOrEmpty(employer.CompanyLogo))
                {
                    await _blobService.DeleteFileIfExistsAsync(employer.CompanyLogo);
                }
                employer.CompanyLogo = await UploadCompanyLogoAsync(dto.CompanyLogo);
            }

            await _context.SaveChangesAsync();
            return _mapper.Map<EmployerDto>(employer);
        }

        public async Task<bool> DeleteAsync(int id, string userId)
        {
            var employer = await _context.Employers.FindAsync(id);
            if (employer == null || employer.UserId != userId) return false;

            if (!string.IsNullOrEmpty(employer.CompanyLogo))
            {
                await _blobService.DeleteFileIfExistsAsync(employer.CompanyLogo);
            }

            _context.Employers.Remove(employer);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}

