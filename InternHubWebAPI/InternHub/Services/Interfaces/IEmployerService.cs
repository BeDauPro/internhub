using System;
using InternHub.DTOs.Common;
using InternHub.DTOs.Employer;

namespace InternHub.Services.Interfaces
{
	public interface IEmployerService
	{
       Task<PagedResult<EmployerDto>> GetEmployersAsync(string? companyName, string? address, string? sortBy, string? sortDirection, int pageNumber, int pageSize);
        Task<EmployerDto?> GetByUserIdAsync(string userId);
        Task<EmployerDto?> GetByIdAsync(int id);
        Task<EmployerDto> CreateAsync(CreateEmployer dto, string userId, IWebHostEnvironment env);
        Task<EmployerDto?> UpdateAsync(int id, UpdateEmployer dto, IWebHostEnvironment env, string userId);
        Task<bool> DeleteAsync(int id, string userId);
        Task<string?> UploadCompanyLogoAsync(IFormFile file);
    }
}

