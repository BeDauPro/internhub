using AutoMapper;
using InternHub.Models;
using InternHub.DTOs.Employer;

namespace InternHub.Profiles
{
    public class EmployerProfile : Profile
    {
        public EmployerProfile()
        {
            CreateMap<Employer, EmployerDto>();

            CreateMap<CreateEmployer, Employer>()
                .ForMember(dest => dest.CompanyLogo, opt => opt.Ignore());

            CreateMap<UpdateEmployer, Employer>()
                .ForMember(dest => dest.CompanyLogo, opt => opt.Ignore());
        }
    }
}
