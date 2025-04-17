using System;
using Microsoft.VisualBasic.FileIO;
using static InternHub.Models.Enums.EmptyClass;

namespace InternHub.Models.ViewModels
{
    public class FileUploadModel
    {
        public IFormFile FileDetails { get; set; }
        public FileType FileType { get; set; }
    }
}

