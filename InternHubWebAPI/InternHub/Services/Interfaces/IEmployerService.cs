using System;
using InternHub.DTOs.Employer;

namespace InternHub.Services.Interfaces
{
	public interface IEmployerService
	{
        Task<List<EmployerDto>> GetAllAsync(bool isAdmin = false);
        Task<EmployerDto?> GetByUserIdAsync(string userId);
        Task<EmployerDto?> GetByIdAsync(int id);
        Task<EmployerDto> CreateAsync(CreateEmployer dto, string userId, IWebHostEnvironment env);
        Task<EmployerDto?> UpdateAsync(int id, UpdateEmployer dto, IWebHostEnvironment env, string userId);
        Task<bool> DeleteAsync(int id, string userId);
    }
}

