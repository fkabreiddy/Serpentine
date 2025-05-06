using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using OneOf;
using SerpentineApi.Executors;
using SerpentineApi.Helpers;
using SerpentineApi.Identity;
using SerpentineApi.Responses;
using SerpentineApi.Utilities;

namespace SerpentineApi.Features.UserFeatures.Actions;

public class AuthenticateUserRequest : IRequest<OneOf<UserResponse, IApiResult>>
{
    
    [Required, FromBody, JsonPropertyName("userName"), MaxLength(30), MinLength(3), RegularExpression("^[a-zA-Z0-9._]+$")]
    public string Username { get; set; }
    
    [Required, FromBody, MaxLength(30), JsonPropertyName("password"), MinLength(8)]
    public string Password { get; set; }
}

public class GetChannelActiveUsersQueryValidator : AbstractValidator<AuthenticateUserRequest>
{
    public GetChannelActiveUsersQueryValidator()
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

                            return ResultsBuilder.Match<UserResponse>(error);
                        }

                        var user = result.AsT0;

                        var token = builder.GenerateToken(user);

                        if (token is null)
                        {
                            return Results.BadRequest(new BadRequestApiResult(){Message = "Error creating token"});
                        }
                        
                        return Results.Ok(new SuccessApiResult<Jwt>(){Data = token});
                    });
                }
        )
        .DisableAntiforgery()
        .AllowAnonymous()
        .Accepts<AuthenticateUserRequest>(false, "application/json")
        .Produces<SuccessApiResult<Jwt>>(200)
        .Produces<NotFoundApiResult>(404)
        .Produces<BadRequestApiResult>(400)
        .Produces<ServerErrorApiResult>(500)
        .Produces<ValidationApiResult>(400)
        .WithName(nameof(AuthenticateUserEndpoint));
    }

  


}

internal class AuthenticateUserRequestHandler()
    : IEndpointHandler<AuthenticateUserRequest, OneOf<UserResponse, IApiResult>>
{
    public async Task<OneOf<UserResponse, IApiResult>> HandleAsync(
        AuthenticateUserRequest request,
        CancellationToken cancellationToken = default
    )
    {
        if (request.Password == "12345678" && request.Username == "breiddy")
        {
            var userResponse = new UserResponse { Id = 1, Username = "fka.breiddy" };
            return userResponse;
        }

        return new NotFoundApiResult(){Message = "Invalid credentials"};
    }
}
