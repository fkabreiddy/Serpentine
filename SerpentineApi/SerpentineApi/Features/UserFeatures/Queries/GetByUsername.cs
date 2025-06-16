using System.Text.Json.Serialization;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using SerpentineApi.Helpers;

namespace SerpentineApi.Features.UserFeatures.Queries;



public class GetUserByNameRequest : IRequest<OneOf<UserResponse, Failure>>
{

    [Required, 
    FromQuery(Name = "username"),
    JsonPropertyName("username"),
    MaxLength(30), MinLength(3),
    RegularExpression("^[a-zA-Z0-9._]+$")]
    public string Username { get; set; } = null!;

  
}

public class GetUserByUsernameRequestValidator : AbstractValidator<GetUserByNameRequest>
{
    public GetUserByUsernameRequestValidator()
    {
    
        RuleFor(x => x.Username)
            .NotEmpty()
            .WithMessage("Username is required")
            .Length(3, 30)
            .WithMessage("Username must be between 3 and 30 characters")
            .Matches(@"^[a-zA-Z0-9._]+$")
            .WithMessage("Username can only contain letters, numbers, dots and underscores");
        
        
    
    }
}


internal class GetUserByUsernameEndpoint : IEndpoint
{
    private readonly UserEndpointSettings _settings = new();
    
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(
                _settings.BaseUrl + "/by-username",
                async (
                    [AsParameters] GetUserByNameRequest command,
                    EndpointExecutor<GetUserByUsernameEndpoint> executor,
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

                        
                        return Results.Ok(new SuccessApiResult<UserResponse>(user, $"A user was found with the username: {user.Username}"));
                    });
                }
        )
        .DisableAntiforgery()
        .AllowAnonymous()
        .RequireCors()
        .Accepts<GetUserByNameRequest>(false, "application/json")
        .Produces<SuccessApiResult<UserResponse>>(200)
        .Produces<NotFoundApiResult>(404)
        .Produces<BadRequestApiResult>(400)
        .Produces<ServerErrorApiResult>(500)
        .Produces<ValidationApiResult>(422)
        .Stable()
        .WithName(nameof(GetUserByUsernameEndpoint));
    }

  


}

internal class GetUserByUsernameRequestHandler(
    SerpentineDbContext context

    )
    : IEndpointHandler<GetUserByNameRequest, OneOf<UserResponse, Failure>>
{
    public async Task<OneOf<UserResponse, Failure>> HandleAsync(
        GetUserByNameRequest request,
        CancellationToken cancellationToken = default
    )
    {
        var user = await context.Users.FirstOrDefaultAsync(
            u => u.Username.Trim().ToLower() == request.Username.ToLower().Trim(),
            cancellationToken: cancellationToken);

        if (user is null)
            return new NotFoundApiResult("User not found");

        return user.ToResponse();
    }

  
}
