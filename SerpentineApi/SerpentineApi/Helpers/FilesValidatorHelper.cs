using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SerpentineApi.Helpers
{
    public static class FilesValidatorHelper
    {
        public static bool ValidateImage(IFormFile file)
    {
        var permittedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp", ".img" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (string.IsNullOrEmpty(extension) || !permittedExtensions.Contains(extension))
        {
            return false;
        }

        const long maxFileSize = 5 * 1024 * 1024; // 5MB
        if (file.Length > maxFileSize)
        {
            return false;
        }

        return true;
        
    }
    }
}