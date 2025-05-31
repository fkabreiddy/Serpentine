using System.ComponentModel;
using System.Text.Json.Serialization;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using SerpentineApi.Helpers;
using SerpentineApi.Services.CloudinaryStorage;

namespace SerpentineApi.Features.UserFeatures.Actions;


public class CreateUserRequest : IRequest<OneOf<UserResponse, Failure>>
{
    
    [Required, MaxLength(30), JsonPropertyName("username"), MinLength(3), RegularExpression(@"^[a-zA-Z0-9._]+$"), FromForm]
    public string Username { get; set; } = null!;
    
    [Required, MaxLength(30), RegularExpression(@"^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$"), JsonPropertyName("password"), MinLength(8), FromForm]
    public string Password { get; set; } = null!;
    
    [Required, MaxLength(30), JsonPropertyName("confirmPassword"), MinLength(8), Compare(nameof(Password)), FromForm]
    public string ConfirmPassword { get; set; } = null!;
    
    
    [Required, JsonPropertyName("fullName"), MaxLength(30), MinLength(10), RegularExpression(@"^[\p{L}\p{M}0-9\s]+$"), FromForm]
    public string FullName { get; set; } = null!;
    
    [JsonPropertyName("imageFile"), FileExtensions(Extensions ="jpg, png, webp, img, jpge")]
    public IFormFile? ImageFile { get; set; }

    [BindNever, JsonIgnore] public int Age => GetAge(this.DayOfBirth);
        
    [JsonPropertyName("dayOfBirth"), FromForm, Required]
    public DateTime DayOfBirth { get; set; }

    private int GetAge(DateTime dateOfBirth)
    {
        DateTime hoy = DateTime.Now;
        int edad = hoy.Year - dateOfBirth.Year;

        // Si aún no ha cumplido años este año, se resta uno
        if (dateOfBirth.Date > hoy.AddYears(-edad)) 
        {
            edad--;
        }

        return edad;
    }

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
            .MaximumLength(30).WithMessage("Password must not exceed 30 characters.")
            .Matches(@"[A-Z]+").WithMessage("Password must contain at least one uppercase letter.")
            .Matches(@"\d+").WithMessage("Password must contain at least one number.")
            .Matches(@"[\W_]+").WithMessage("Password must contain at least one special character.");

        RuleFor(x => x.ConfirmPassword)
            .NotEmpty().WithMessage("Confirm Password is required.")
            .Equal(x => x.Password).WithMessage("Passwords do not match.");
        
        RuleFor(x => x.Age)
            .InclusiveBetween(16, 100)
            .WithMessage("Age must be between 16 and 100.");
           
        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Full name is required.")
            .MinimumLength(10).WithMessage("Full name must be at least 10 characters.")
            .MaximumLength(30).WithMessage("Full name must not exceed 30 characters.")
            .Matches(@"^[\p{L}\p{M}0-9\s]+$").WithMessage("Only letters, numbers, and spaces are allowed.");

         

        RuleFor(x => x.ImageFile)
            .Must(file => file == null || file.Length <= 5 * 1024 * 1024) // 5 MB
            .WithMessage("Image file size must not exceed 5 MB.")
            .Must(file => file == null || file.ContentType.StartsWith("image/"))
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
                    [FromForm] CreateUserRequest command,
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

                        return Results.Ok(new SuccessApiResult<UserResponse>(user));
                    });
                }
            )
            .DisableAntiforgery()
            .AllowAnonymous()
            .RequireCors()
            .WithDescription($"Creates an user. Not requires authorization. Accepts an {nameof(CreateUserRequest)}. Returns a ApiResult with an {nameof(UserResponse)}")
            .Accepts<AuthenticateUserRequest>(false, "multipart/form-data")
            .Produces<SuccessApiResult<UserResponse>>(200, "application/json")
            .Produces<ConflictApiResult>(409, "application/json")
            .Produces<BadRequestApiResult>(400, "application/json")
            .Produces<ServerErrorApiResult>(500, "application/json")
            .Produces<ValidationApiResult>(422, "application/json")
            .WithName(nameof(CreateUserEndpoint))
            .Stable()
            ;
    }
}

internal class CreateUserRequestHandler(
    SerpentineDbContext  context,
    CloudinaryService cloudinaryService
    )
    : IEndpointHandler<CreateUserRequest, OneOf<UserResponse, Failure>>
{
    public async Task<OneOf<UserResponse, Failure>> HandleAsync(
        CreateUserRequest request,
        CancellationToken cancellationToken = default
        )
    {

        if (await context.Users.AnyAsync(
            u => u.Username.Trim().ToLower() == request.Username.Trim().ToLower(),
            cancellationToken: cancellationToken
        ))
        {
            return new ConflictApiResult("An user with the same username already exist");
        }
        

        var result = await context.Users.AddAsync(User.Create(request), cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
        
        if (result.Entity.Id > 0)
        {
            if (request.ImageFile is not null)
            {
                var imageUploaded = await cloudinaryService.UploadImage(request.ImageFile, CloudinaryFolders.ProfilePictures.ToString(), result.Entity.Id.ToString());
                if (imageUploaded.TaskSucceded())
                {

                    result.Entity.ProfilePictureUrl = imageUploaded.Data;

                }
            }
           

            await context.SaveChangesAsync(cancellationToken);
            
            context.ChangeTracker.Clear();
            
        }
        else
        {
            return new BadRequestApiResult("Could not create user");
        }


        var user = await context.Users.FirstOrDefaultAsync(u => u.Id == result.Entity.Id, cancellationToken);

        if (user is null)
        {
            return new BadRequestApiResult("Could not create user");
        }
        
        return user.ToResponse();
    }
}
