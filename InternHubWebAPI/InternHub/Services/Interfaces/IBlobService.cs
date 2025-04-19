using System;

namespace InternHub.Services.Interfaces
{
    public interface IBlobService
    {
        Task<string> UploadFileAsync(IFormFile file, string folderPath);
    }
}
