using System.Net;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;

namespace SerpentineApi.Services.CloudinaryStorage;

public class CloudinaryService
{
    private readonly CloudinarySettings _settings;
    private CloudinaryDotNet.Cloudinary _cloudinary;

    public CloudinaryService(IOptions<CloudinarySettings> cloudinarySettings)
    {
        _settings = cloudinarySettings.Value;
        _cloudinary = new CloudinaryDotNet.Cloudinary(_settings.Url);
    }

    private const long MaxFileSizeInBytes = 10 * 1024 * 1024; // 10MB

    public enum ImageVerificationResult
    {
        ImageSize,
        ImageFormat,
        Success,
    }

    private (string, ImageVerificationResult) VerifyImage(IFormFile image)
    {
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };

        var extension = Path.GetExtension(image.FileName).ToLower();

        if (!allowedExtensions.Contains(extension))
            return (
                "the file format is not correct. Images only.",
                ImageVerificationResult.ImageFormat
            );

        if (image.Length > MaxFileSizeInBytes)
            return ("Image size is over 10mb.", ImageVerificationResult.ImageSize);

        return ("Success", ImageVerificationResult.Success);
    }

    public async Task<InternalResult<string>> UploadImage(
        IFormFile image,
        string folderName,
        string fileName,
        bool isUnique = false,
        int? width = null,
        int? height = null
    )
    {
        if (VerifyImage(image) is var reason && reason.Item2 != ImageVerificationResult.Success)
            return new InternalResult<string>(
                false,
                message: "Error with the image format or size",
                errors: [reason.Item1]
            );

        await using var stream = image.OpenReadStream();

        var transformation = new Transformation();

        transformation.Quality(100);
        transformation.Gravity("auto");
        transformation.Crop("fill");

        if (width is not null)
        {
            transformation.Width(width);
        }

        if (height is not null)
        {
            transformation.Height(height);
        }

        var uploadParams = new ImageUploadParams()
        {
            File = new FileDescription(fileName, stream),
            PublicId = $"{fileName}",
            Overwrite = true,
            UseFilename = true,
            UniqueFilename = isUnique,
            Folder = folderName,
            Transformation = transformation,
        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams);

        if (uploadResult.StatusCode == HttpStatusCode.OK)
        {
            if (
                string.IsNullOrEmpty(uploadResult.SecureUrl?.AbsoluteUri)
                || uploadResult.SecureUrl?.AbsoluteUri is null
            )
            {
                return new(
                    false,
                    message: "Error uploading the image",
                    errors: ["Could not obtain the image url. Try again later."]
                );
            }

            return new(true, data: uploadResult.SecureUrl.AbsoluteUri);
        }

        return new(
            false,
            message: "Error uploading the image",
            errors: [uploadResult.Error?.Message ?? "Unknown error occurred."]
        );
    }

    public async Task<InternalResult<bool>> DeleteImageAsync(string fileName, string folderName)
    {
        var deleteParams = new DeletionParams($"{folderName}/{fileName}")
        {
            ResourceType = ResourceType.Image,
        };

        var result = await _cloudinary.DestroyAsync(deleteParams);

        if (result.StatusCode == HttpStatusCode.OK)
        {
            return new InternalResult<bool>(true, true);
        }

        return new InternalResult<bool>(false, false, result.Error.Message, [result.Error.Message]);
    }
}
