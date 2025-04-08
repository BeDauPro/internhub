using AutoMapper;
using InternHub.Models;
using InternHub.DTOs.Student;

namespace InternHub.Profiles
{
    public class StudentProfile : Profile
    {
        public StudentProfile()
        {
            CreateMap<Student, StudentDto>();
            CreateMap<CreateStudentDto, Student>()
                .ForMember(dest => dest.ProfilePicture, opt => opt.Ignore())
                .ForMember(dest => dest.CVFile, opt => opt.Ignore());
            CreateMap<UpdateStudentDto, Student>()
                .ForMember(dest => dest.ProfilePicture, opt => opt.Ignore())
                .ForMember(dest => dest.CVFile, opt => opt.Ignore());
        }
    }
}
