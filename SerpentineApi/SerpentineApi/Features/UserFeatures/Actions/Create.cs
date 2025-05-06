

using System.Net.Mime;
using System.Reflection;
using System.Text.Json.Serialization;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using SerpentineApi.Helpers;
using SerpentineApi.Identity;

namespace SerpentineApi.Features.UserFeatures.Actions;


public class CreateUserRequest : IRequest<OneOf<UserResponse, IApiResult>>
{
    
    [Required, MaxLength(30), JsonPropertyName("userName"), MinLength(3), RegularExpression(@"^[a-zA-Z0-9._]+$"), FromForm]
    public string Username { get; set; } = null!;
    
    [Required, MaxLength(30), JsonPropertyName("password"), MinLength(8), FromForm]
    public string Password { get; set; } = null!;

    [FromForm, JsonPropertyName("profilePictureUrl")]
    public string? ProfilePictureUrl { get; set; } 
    
    [Required, JsonPropertyName("fullName"), MaxLength(30), MinLength(10), RegularExpression(@"^[\p{L}\p{M}0-9\s]+$", ErrorMessage = "Only letters, numbers, and spaces are allowed."), FromForm]
    public string FullName { get; set; } = null!;
    
    [Required, Range(16, 100), FromForm]
    public int Age { get; set; }
    
    [Required, JsonPropertyName("imageFile")]
    public IFormFile ImageFile { get; set; } = null!;
}

public class CreateUserRequestValidator : AbstractValidator<CreateUserRequest>
{
    public CreateUserRequestValidator()
    {
        RuleFor(x => x.Username)
            .NotEmpty().WithMessage("Username is required.")
            .MinimumLength(3).WithMessage("Username must be at least 3 characters.")
            .MaximumLength(30).WithMessage("Username must not exceed 30 characters.")
            .Matches(@"^[a-zA-Z0-9._]+$").WithMessage("Username can only contain letters, numbers, dots, and underscores.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required.")
            .MinimumLength(8).WithMessage("Password must be at least 8 characters.")
            .MaximumLength(30).WithMessage("Password must not exceed 30 characters.");

        RuleFor(x => x.ProfilePictureUrl)
            .Must(uri => uri == null || new Uri(uri).IsAbsoluteUri)
            .WithMessage("Profile picture URL must be a valid absolute URI if provided.");
        
        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Full name is required.")
            .MinimumLength(10).WithMessage("Full name must be at least 10 characters.")
            .MaximumLength(30).WithMessage("Full name must not exceed 30 characters.")
            .Matches(@"^[\p{L}\p{M}0-9\s]+$").WithMessage("Only letters, numbers, and spaces are allowed.");

        RuleFor(x => x.Age)
            .InclusiveBetween(16, 100).WithMessage("Age must be between 16 and 100.");

        RuleFor(x => x.ImageFile)
            .NotNull().WithMessage("Image file is required.")
            .Must(file => file.Length <= 5 * 1024 * 1024) // 5 MB
            .WithMessage("Image file size must not exceed 5 MB.")
            .Must(file => file.ContentType.StartsWith("image/"))
            .WithMessage("Image file must be an image type.");
    }
}

public class CreateUserEndpoint : IEndpoint
{
    private readonly UserEndpointSettings _settings = new();
    
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(
                _settings.BaseUrl + "/create",
                async (
                    [AsParameters] CreateUserRequest command,
                    EndpointExecutor<CreateUserEndpoint> executor,
                    CancellationToken cancellationToken,
                    ISender sender
                ) =>
                {
                    return await executor.ExecuteAsync<UserResponse>(async () =>
                    {
                        

                        var result = await sender.SendAndValidateAsync(command, cancellationToken);
                        
                        if (result.IsT1)
                        {
                            var error = result.AsT1;
                            return ResultsBuilder.Match<UserResponse>(error);
                        }

                        var user = result.AsT0;
                        
                        return Results.Ok(new SuccessApiResult<UserResponse>(){Data = user});
                    });
                }
            )
            .DisableAntiforgery()
            .AllowAnonymous()
            .Accepts<AuthenticateUserRequest>(false, "multipart/form-data")
            .Produces<SuccessApiResult<UserResponse>>(200, "application/json")
            .Produces<ConflictApiResult>(409, "application/json")
            .Produces<BadRequestApiResult>(400, "application/json")
            .Produces<ServerErrorApiResult>(500, "application/json")
            .Produces<ValidationApiResult>(400, "application/json")
            .WithName(nameof(CreateUserEndpoint));
    }
}

internal class CreateUserRequestHandler(
    DbContextAccessor<User> dbContextAccessor
    )
    : IEndpointHandler<CreateUserRequest, OneOf<UserResponse, IApiResult>>
{
    public async Task<OneOf<UserResponse, IApiResult>> HandleAsync(
        CreateUserRequest request,
        CancellationToken cancellationToken = default
        )
    {

        if (await dbContextAccessor.ExistsAsync(
            u => u.Username.Trim().ToLower() == request.Username.Trim().ToLower(),
            cancellationToken: cancellationToken
        ))
        {
            return new ConflictApiResult(){Message = "An user with the same username already exist"};
        }

        var result = await dbContextAccessor.AddAsync(User.Create(request), token: cancellationToken);
        dbContextAccessor.StopTracking();
        
        if (result.Id <= 0)
        {
            return new BadRequestApiResult(){Message = "We couldn't create a user"};
        }

        return result.ToResponse();
    }
}
