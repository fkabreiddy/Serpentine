using System.Text.Json.Serialization;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using SerpentineApi.DataAccess.Context.EntityExtensions;
using SerpentineApi.Helpers;
using SerpentineApi.Helpers;
using SerpentineApi.Identity;
using SerpentineApi.Services.CloudinaryStorage;

namespace SerpentineApi.Features.ChannelFeatures.Actions;

public class UpdateBannerRequest : RequestWithUserCredentials, IRequest<OneOf<string, Failure>>
{
    [
        FromForm(Name = "bannerPictureFile"),
        JsonPropertyName("bannerPictureFile"),
        FileExtensions(Extensions = "jpg, png, webp, img, jpeg")
    ]
    public IFormFile? BannerPictureFile { get; set; } = null;

    [Required, FromForm(Name = "channelId"), JsonPropertyName("channelId")]
    public Ulid ChannelId { get; set; }
}

public class UpdateBannerRequestValidator : AbstractValidator<UpdateBannerRequest>
{
    public UpdateBannerRequestValidator()
    {
        RuleFor(x => x.BannerPictureFile)
            .Must(file =>
            {
                if (file == null)
                    return true;
                var allowedExtensions = new[] { ".jpg", ".png", ".webp", ".img", ".jpeg" };
                var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
                return allowedExtensions.Contains(ext);
            })
            .WithMessage("The file extension is not valid. Use jpg, png, webp, img o jpeg.");

        RuleFor(x => x.ChannelId)
            .Must(x => UlidHelper.IsValid(x))
            .WithMessage("Channel Id should be a valid Ulid");
    }
}

internal class UpdateBannerEndpoint : IEndpoint
{
    private readonly ChannelEndpointSettings _settings = new();

    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPatch(
                _settings.BaseUrl + "/banner",
                async (
                    [FromForm] UpdateBannerRequest command,
                    EndpointExecutor<UpdateBannerEndpoint> executor,
                    CancellationToken cancellationToken,
                    ISender sender,
                    HttpContext context
                ) =>
                    await executor.ExecuteAsync<string>(async () =>
                    {
                        command.SetCurrentUserId(
                            UserIdentityRequesterHelper.GetUserIdFromClaims(context.User)
                        );
                        var result = await sender.SendAndValidateAsync(command, cancellationToken);

                        if (result.IsT1)
                        {
                            var t1 = result.AsT1;

                            return ResultsBuilder.Match(t1);
                        }

                        var t0 = result.AsT0;

                        return ResultsBuilder.Match<string>(new SuccessApiResult<string>(t0));
                    })
            )
            .DisableAntiforgery()
            .RequireAuthorization(nameof(AuthorizationPolicies.AllowAllUsers))
            .RequireCors()
            .Experimental()
            .WithOpenApi()
            .WithDescription(
                "Updates or delete the banner of a channel with a certain Id.Requires Authorization. \n Requires CORS."
            )
            .WithTags(new string[] { nameof(ApiHttpVerbs.Patch), nameof(Channel) })
            .Accepts<UpdateBannerRequest>(false, ApiContentTypes.MultipartForm)
            .Produces<SuccessApiResult<string>>(200)
            .Produces<BadRequestApiResult>(400, ApiContentTypes.ApplicationJson)
            .Produces<ServerErrorApiResult>(500, ApiContentTypes.ApplicationJson)
            .Produces<ValidationApiResult>(422, ApiContentTypes.ApplicationJson)
            .Produces<NotFoundApiResult>(404, ApiContentTypes.ApplicationJson)
            .WithName(nameof(UpdateBannerEndpoint));
    }
}

internal class UpdateBannerEndpointHandler(
    CloudinaryService cloudinary,
    SerpentineDbContext context
) : IEndpointHandler<UpdateBannerRequest, OneOf<string, Failure>>
{
    public async Task<OneOf<string, Failure>> HandleAsync(
        UpdateBannerRequest request,
        CancellationToken cancellationToken = default
    )
    {
        if (
            !await context.ChannelMembers.AnyAsync(
                cm => (cm.IsAdmin || cm.IsOwner) && cm.ChannelId == request.ChannelId,
                cancellationToken
            )
        )
        {
            return new ForbiddenApiResult(
                "You don't have permisson to change the banner of this channel"
            );
        }

        if (request.BannerPictureFile is null)
        {
            var deletionResult = await cloudinary.DeleteImageAsync(
                request.ChannelId.ToString(),
                CloudinaryFolders.ChannelBanners.ToString()
            );

            if (!deletionResult.TaskSucceded())
            {
                return new NotFoundApiResult(
                    $"We had some errors deleting the banner: {deletionResult.Message}",
                    deletionResult.Errors
                );
            }

            await context
                .Channels.Where(ch => ch.Id == request.ChannelId)
                .ExecuteUpdateAsync(
                    x => x.SetProperty(y => y.BannerPicture, ""),
                    cancellationToken
                );

            return "Channel banner deleted successfuly";
        }
        else
        {
            var deletionResult = await cloudinary.DeleteImageAsync(
                request.ChannelId.ToString(),
                CloudinaryFolders.ChannelBanners.ToString()
            );

            if (!deletionResult.TaskSucceded())
            {
                return new NotFoundApiResult(
                    $"We had some errors deleting the banner: {deletionResult.Message}",
                    deletionResult.Errors
                );
            }

            var insertionResult = await cloudinary.UploadImage(
                request.BannerPictureFile,
                CloudinaryFolders.ChannelBanners.ToString(),
                request.ChannelId.ToString()
            );

            if (!insertionResult.TaskSucceded())
            {
                return new BadRequestApiResult(
                    $"We had some errors adding the banner: {deletionResult.Message}",
                    deletionResult.Errors
                );
            }

            await context
                .Channels.Where(ch => ch.Id == request.ChannelId)
                .ExecuteUpdateAsync(
                    x => x.SetProperty(y => y.BannerPicture, insertionResult.Data),
                    cancellationToken
                );

            return insertionResult.Data;
        }
    }
}
