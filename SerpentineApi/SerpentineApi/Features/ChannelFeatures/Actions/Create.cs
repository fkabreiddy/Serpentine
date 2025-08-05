using System.Text.Json.Serialization;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using SerpentineApi.DataAccess.Context.EntityExtensions;
using SerpentineApi.Helpers;
using SerpentineApi.Services.CloudinaryStorage;

namespace SerpentineApi.Features.ChannelFeatures.Actions;

public class CreateChannelRequest : IRequest<OneOf<ChannelResponse, Failure>>
{
    [
        MaxLength(100),
        MinLength(3),
        RegularExpression(@"^[a-zA-Z0-9._]+$"),
        Required,
        JsonPropertyName("name"),
        FromForm,
        DataType(DataType.Text)
    ]
    public string Name { get; set; } = null!;

    [MaxLength(500), MinLength(10), Required, JsonPropertyName("description"), FromForm]
    public string Description { get; set; } = null!;

    [Required, FromForm, JsonPropertyName("adultContent")]
    public bool AdultContent { get; set; } = false;

    [BindNever, JsonIgnore]
    public Ulid CurrentUserId { get; private set; }

    [
        FromForm,
        JsonPropertyName("bannerPictureFile"),
        FileExtensions(Extensions = "jpg, png, webp, img, jpge")
    ]
    public IFormFile? BannerPictureFile { get; set; }

    [
        FromForm,
        JsonPropertyName("coverPictureFile"),
        FileExtensions(Extensions = "jpg, png, webp, img, jpge")
    ]
    public IFormFile? CoverPictureFile { get; set; }
    
    [BindNever, JsonIgnore]
    public Ulid RoleId { get; private set; } 
    
    public void SetRoleId(Ulid roleId)
    {
        RoleId = roleId;
    }

    public void SetCurrentUserId(Ulid userId)
    {
        CurrentUserId = userId;
    }
    
    
}

public class CreateChannelRequestValidator : AbstractValidator<CreateChannelRequest>
{
    public CreateChannelRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Name is required.")
            .MinimumLength(3)
            .WithMessage("Name must be at least 3 characters long.")
            .MaximumLength(100)
            .WithMessage("Name cannot exceed 100 characters.")
            .Matches(@"^[a-zA-Z0-9._]+$")
            .WithMessage("Name can only contain letters, numbers, dots, and underscores.");

        RuleFor(x => x.Description)
            .NotEmpty()
            .WithMessage("Description is required.")
            .MinimumLength(10)
            .WithMessage("Description must be at least 10 characters long.")
            .MaximumLength(500)
            .WithMessage("Description cannot exceed 500 characters.");

        RuleFor(x => x.AdultContent).NotNull().WithMessage("Adult content flag must be specified.");
    }
}

internal class CreateChannelEndpoint : IEndpoint
{
    private readonly ChannelEndpointSettings _settings = new();

    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(
                _settings.BaseUrl + "/create",
                async (
                    [FromForm] CreateChannelRequest command,
                    EndpointExecutor<CreateChannelEndpoint> executor,
                    CancellationToken cancellationToken,
                    ISender sender,
                    HttpContext context
                ) =>
                {
                    return await executor.ExecuteAsync<ChannelResponse>(async () =>
                    {
                        command.SetCurrentUserId(
                            UserIdentityRequesterHelper.GetUserIdFromClaims(context.User)
                        );
                        var result = await sender.SendAndValidateAsync(command, cancellationToken);
                        if (result.IsT1)
                        {
                            var error = result.AsT1;
                            return ResultsBuilder.Match<ChannelResponse>(error);
                        }

                        var channelResponse = result.AsT0;
                        return Results.Ok(new SuccessApiResult<ChannelResponse>(channelResponse));
                    });
                }
            )
            .DisableAntiforgery()
            .RequireAuthorization(JwtBearerDefaults.AuthenticationScheme)
            .RequireCors()
            .Stable()
            .WithOpenApi()
            .WithTags(new[] { "POST", $"{nameof(Channel)}" })
            .Accepts<CreateChannelRequest>(false, "multipart/form-data")
            .Produces<SuccessApiResult<ChannelResponse>>(200)
            .Produces<ConflictApiResult>(409, "application/json")
            .Produces<BadRequestApiResult>(400, "application/json")
            .WithDescription(
                $"Creates a channel in the database. Requires a {nameof(CreateChannelRequest)}. Return {nameof(ChannelResponse)}"
            )
            .Produces<ServerErrorApiResult>(500, "application/json")
            .Produces<ValidationApiResult>(422, "application/json")
            .WithName(nameof(CreateChannelEndpoint));
    }
}

internal class CreateChannelRequestHandler(
    SerpentineDbContext context,
    CloudinaryService cloudinaryService
) : IEndpointHandler<CreateChannelRequest, OneOf<ChannelResponse, Failure>>
{
    public async Task<OneOf<ChannelResponse, Failure>> HandleAsync(
        CreateChannelRequest request,
        CancellationToken cancellationToken = default
    )
    {
        if (request.CurrentUserId.ToString() == "")
            return new UnauthorizedApiResult(
                "You are trying to create a channel without being logged in"
            );
        
       
        var channel = Channel.Create(request);

        var exist = await context.Channels.AnyAsync(
            ch => ch.Name.ToLower() == channel.Name,
            cancellationToken: cancellationToken
        );

        if (exist)
            return new ConflictApiResult(
                $"Another channel with the same name {channel.Name} already exists"
            );

        // Start transaction
        await using var transaction = await context.Database.BeginTransactionAsync(
            cancellationToken
        );

        try
        {
          
            
            var creation = await context.Channels.AddAsync(channel, cancellationToken);

            await context.SaveChangesAsync(cancellationToken);

            if (request.CoverPictureFile is not null)
            {
                var coverUploadResponse = await cloudinaryService.UploadImage(
                    request.CoverPictureFile,
                    CloudinaryFolders.ChannelCovers.ToString(),
                    creation.Entity.Id.ToString(),
                    false,
                    100,
                    100
                );
                if (coverUploadResponse.IsSuccess)
                {
                    creation.Entity.CoverPicture = coverUploadResponse.Data;
                }
                else
                {
                    await transaction.RollbackAsync(cancellationToken);
                    return new BadRequestApiResult(
                        coverUploadResponse.Message,
                        coverUploadResponse.Errors
                    );
                }
            }

            if (request.BannerPictureFile is not null)
            {
                var bannerUploadResponse = await cloudinaryService.UploadImage(
                    request.BannerPictureFile,
                    CloudinaryFolders.ChannelBanners.ToString(),
                    creation.Entity.Id.ToString(),
                    false,
                    300,
                    300
                  
                );
                if (bannerUploadResponse.IsSuccess)
                {
                    creation.Entity.BannerPicture = bannerUploadResponse.Data;
                }
                else
                {
                    await transaction.RollbackAsync(cancellationToken);
                    return new BadRequestApiResult(
                        bannerUploadResponse.Message,
                        bannerUploadResponse.Errors
                    );
                }
            }

            await context.SaveChangesAsync(cancellationToken);


            Channel? response = await context.Channels.GetChannelsWithJustMyMembershipByChannelId(
                creation.Entity.Id,
                request.CurrentUserId,
                cancellationToken
            );


            if (response is null)
            {
                await transaction.RollbackAsync(cancellationToken);
                return new NotFoundApiResult(
                    "We could not find the channel you created. Try again."
                );
            }

            await transaction.CommitAsync(cancellationToken);
            return response.ToResponse();
        }
        catch (Exception)
        {
            await transaction.RollbackAsync(cancellationToken);
            throw;
        }
    }
}
