using System.Net;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;

namespace SerpentineApi.Services.CloudinaryStorage;

public class CloudinaryService
{
    private readonly CloudinarySettings _settings;
    private CloudinaryDotNet.Cloudinary _cloudinary;
   
    private ImageUploadParams BuildUploadUserProfilePictureParams(Stream stream, Ulid publicId)
    {
        var transformation = new Transformation()
            .Width(150)
            .Height(150)
            .Gravity("face")
            .Crop("thumb")
            .Quality(100);

        return new ImageUploadParams()
        {
            File = new FileDescription(publicId.ToString(), stream),
            PublicId = publicId.ToString(),
            Overwrite = true,
            UseFilename = true,
            UniqueFilename = true,
            Folder = CloudinaryFolders.ProfilePictures,
            Transformation = transformation,
        };
    }

    private ImageUploadParams BuildUploadChannelCoverParams(Stream stream, Ulid publicId)
    {
        var transformation = new Transformation()
            .Width(150)
            .Height(150)
            .Gravity(Gravity.Center)
            .Crop("thumb")
            .Quality(100);

        return new ImageUploadParams()
        {
            File = new FileDescription(publicId.ToString(), stream),
            PublicId = publicId.ToString(),
            Overwrite = true,
            UseFilename = true,
            UniqueFilename = true,
            Folder = CloudinaryFolders.ChannelCovers,
            Transformation = transformation,
        };
    }

 private ImageUploadParams BuildUploadChannelBannerParams(Stream stream, Ulid publicId)
    {
        var transformation = new Transformation()
           
            .Quality(100);

        return new ImageUploadParams()
        {
            File = new FileDescription(publicId.ToString(), stream),
            PublicId = publicId.ToString(),
            Overwrite = true,
            UseFilename = true,
            UniqueFilename = true,
            Folder = CloudinaryFolders.ChannelBanners,
            Transformation = transformation,
        };
    }




    public CloudinaryService(IOptions<CloudinarySettings> cloudinarySettings)
    {
        _settings = cloudinarySettings.Value;
        _cloudinary = new CloudinaryDotNet.Cloudinary(_settings.Url);
    }

    private const long MaxFileSizeInBytes = 10 * 1024 * 1024; // 10MB



    private InternalResult<string> VerifyImage(IFormFile image)
    {
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };

        var extension = Path.GetExtension(image.FileName).ToLower();

        if (!allowedExtensions.Contains(extension))
            return new InternalResult<string>(
                false,
                "the file format is not correct. Images only."
                
            );

        if (image.Length > MaxFileSizeInBytes)
            return new InternalResult<string>(
                false,
                "Image size is over 10mb."
            );

        return new InternalResult<string>(true, "Success");
    }


    private InternalResult<string> ProcessResult(
        UploadResult uploadResult
    ) {
        if (uploadResult.StatusCode == HttpStatusCode.OK)
        {
            if (
                string.IsNullOrEmpty(uploadResult.SecureUrl?.AbsoluteUri)
                || uploadResult.SecureUrl?.AbsoluteUri is null
            )
            {
                return new(
                    false,
                    message: "Error uploading the file",
                    errors: ["Could not obtain the file url. Try again later."]
                );
            }

            return new(true, data: uploadResult.SecureUrl.AbsoluteUri);
        }

        return new(
            false,
            message: "Error uploading the file",
            errors: [uploadResult.Error?.Message ?? "Unknown error occurred."]
        );
    }
   

    public async Task<InternalResult<string>> UploadImage(
        IFormFile image,
        Ulid publicId,
        UploadType type
    )
    {
        if (VerifyImage(image) is var verification && !verification.IsSuccess)
        {
            return verification;
        }

        await using var stream = image.OpenReadStream();

        var uploadParams = type switch
        {
            UploadType.UserProfilePicture => BuildUploadUserProfilePictureParams(stream, publicId),
            UploadType.ChannelBanner => BuildUploadChannelBannerParams(stream, publicId),
            UploadType.ChannelCover => BuildUploadChannelCoverParams(stream, publicId),
            _ => throw new ArgumentOutOfRangeException(nameof(type), type, null)
        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams);

       return ProcessResult(uploadResult);
    }

    public async Task<InternalResult<bool>> DeleteFileAsync(string fileName, string folderName)
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

 public enum UploadType {
        ChannelCover,
        ChannelBanner,
        UserProfilePicture,
    }
