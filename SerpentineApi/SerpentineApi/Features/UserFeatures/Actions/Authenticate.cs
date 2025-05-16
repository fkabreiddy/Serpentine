using System.Text.Json.Serialization;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using SerpentineApi.Helpers;
using SerpentineApi.Identity;

namespace SerpentineApi.Features.UserFeatures.Actions;

public class AuthenticateUserRequest : IRequest<OneOf<UserResponse, Failure>>
{

    [Required, FromBody, JsonPropertyName("userName"), MaxLength(30), MinLength(3),
     RegularExpression("^[a-zA-Z0-9._]+$")]
    public string Username { get; set; } = null!;

    [Required, FromBody, MaxLength(30), JsonPropertyName("password"), MinLength(8)]
    public string Password { get; set; } = null!;
}

public class AuthenticateUserRequestValidator : AbstractValidator<AuthenticateUserRequest>
{
    public AuthenticateUserRequestValidator()
    {
    
        RuleFor(x => x.Username)
            .NotEmpty()
            .WithMessage("Username is required")
            .Length(3, 30)
            .WithMessage("Username must be between 3 and 30 characters")
            .Matches(@"^[a-zA-Z0-9._]+$")
            .WithMessage("Username can only contain letters, numbers, dots and underscores");
        

        RuleFor(x => x.Password)
            .NotEmpty()
            .WithMessage("Password is required")
            .Length(8, 30)
            .WithMessage("Password must be between 8 and 30 characters");
    
    }
}


internal class AuthenticateUserEndpoint : IEndpoint
{
    private readonly UserEndpointSettings _settings = new();
    
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(
                _settings.BaseUrl + "/authenticate",
                async (
                    [FromBody] AuthenticateUserRequest command,
                    EndpointExecutor<AuthenticateUserEndpoint> executor,
                     CancellationToken cancellationToken,
                     ISender sender,
                    JwtBuilder builder
                ) =>
                {
                    return await executor.ExecuteAsync<Jwt>(async () =>
                    {
                        

                        var result = await sender.SendAndValidateAsync(command, cancellationToken);
                        if (result.IsT1)
                        {
                            var error = result.AsT1;

                            return ResultsBuilder.Match<Jwt>(error);
                        }

                        var user = result.AsT0;

                        var token = builder.GenerateToken(user);

                        if (token is null)
                        {
                            return Results.BadRequest(new BadRequestApiResult(){Message = "Error creating token"});
                        }
                        
                        return Results.Ok(new SuccessApiResult<Jwt>(token));
                    });
                }
        )
        .DisableAntiforgery()
        .AllowAnonymous()
        .RequireCors()
        .Accepts<AuthenticateUserRequest>(false, "application/json")
        .Produces<SuccessApiResult<Jwt>>(200)
        .Produces<NotFoundApiResult>(404)
        .Produces<BadRequestApiResult>(400)
        .Produces<ServerErrorApiResult>(500)
        .Produces<ValidationApiResult>(422)
        .WithName(nameof(AuthenticateUserEndpoint));
    }

  


}

internal class AuthenticateUserRequestHandler(
    DbContextAccessor<User> dbContextAccessor

    )
    : IEndpointHandler<AuthenticateUserRequest, OneOf<UserResponse, Failure>>
{
    public async Task<OneOf<UserResponse, Failure>> HandleAsync(
        AuthenticateUserRequest request,
        CancellationToken cancellationToken = default
    )
    {

        var hashedPassword = request.Password.Hash();
        var user = await dbContextAccessor.GetAnyAsync(
            u => u.Username.Trim().ToLower() == request.Username.ToLower().Trim() && u.Password == hashedPassword,
            cancellationToken: cancellationToken);


        if (user is null)
            return new NotFoundApiResult("Invalid credentials");

        return user.ToResponse();
    }

  
}
