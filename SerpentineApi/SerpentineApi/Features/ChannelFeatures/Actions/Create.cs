using System.Text.Json.Serialization;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using SerpentineApi.Features.UserFeatures.Actions;
using SerpentineApi.Helpers;
using SerpentineApi.Identity;

namespace SerpentineApi.Features.ChannelFeatures.Actions;

public class CreateChannelRequest : IRequest<OneOf<ChannelResponse, Failure>>
{
    [MaxLength(100),
     MinLength(3),
     RegularExpression(@"^[a-zA-Z0-9._]+$"), 
     Required, JsonPropertyName("name"), FromBody]
    public string Name { get; set; } = null!;

    [MaxLength(500), 
     MinLength(10),
     Required, 
     JsonPropertyName("description"), 
     FromBody]
    public string Description { get; set; } = null!;

    [Required, FromBody, JsonPropertyName("adultContent")]
    public bool AdultContent { get; set; } = false;

    [BindNever, JsonIgnore]
    public int CurrentUserId { get; private set; }

    public void SetCurrentUserId(int? userId)
    {
        CurrentUserId = userId ?? 0;
    }

}

public class CreateChannelRequestValidator : AbstractValidator<CreateChannelRequest>
{
    public CreateChannelRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required.")
            .MinimumLength(3).WithMessage("Name must be at least 3 characters long.")
            .MaximumLength(100).WithMessage("Name cannot exceed 100 characters.")
            .Matches(@"^[a-zA-Z0-9._]+$").WithMessage("Name can only contain letters, numbers, dots, and underscores.");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required.")
            .MinimumLength(10).WithMessage("Description must be at least 10 characters long.")
            .MaximumLength(500).WithMessage("Description cannot exceed 500 characters.");

        RuleFor(x => x.AdultContent)
            .NotNull().WithMessage("Adult content flag must be specified.");
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
                    [FromBody] CreateChannelRequest command,
                    EndpointExecutor<CreateChannelEndpoint> executor,
                    CancellationToken cancellationToken,
                    ISender sender,
                    HttpContext context
                ) =>
                {
                    return await executor.ExecuteAsync<ChannelResponse>(async () =>
                    {
                        
                        command.SetCurrentUserId(UserIdentityRequesterHelper.GetUserIdFromClaims(context.User));
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
            .Accepts<CreateChannelRequest>(false, "application/json")
            .Produces<SuccessApiResult<ChannelResponse>>(200)
            .Produces<ConflictApiResult>(409, "application/json")
            .Produces<BadRequestApiResult>(400, "application/json")
            .WithDescription($"Creates a channel in the database. Requires a {nameof(CreateChannelRequest)}. Return {nameof(ChannelResponse)}")
            .Produces<ServerErrorApiResult>(500, "application/json")
            .Produces<ValidationApiResult>(422, "application/json")
            .WithName(nameof(CreateChannelEndpoint));
    }
}

internal class CreateChannelRequestHandler(
   SerpentineDbContext context

)
    : IEndpointHandler<CreateChannelRequest, OneOf<ChannelResponse, Failure>>
{
    public async Task<OneOf<ChannelResponse, Failure>> HandleAsync(
        CreateChannelRequest request,
        CancellationToken cancellationToken = default
    )
    {
        if (request.CurrentUserId == 0)
            return new UnauthorizedApiResult("You are trying to create a channel without being logged in");
        
        var channel = Channel.Create(request);
        await using var transaction = await context.Database.BeginTransactionAsync(cancellationToken);
        
        var exist = await context.Channels.AnyAsync(ch => ch.Name.ToLower() == channel.Name, cancellationToken:cancellationToken);
      
        if(exist)
            return new ConflictApiResult($"Another channel with the same name {channel.Name} already exists");
        
        var creation = await context.Channels.AddAsync(channel, cancellationToken);
        
        await context.SaveChangesAsync(cancellationToken);
        
        await transaction.CommitAsync(cancellationToken);

        var response = creation.Entity.ToResponse();

        
        context.ChangeTracker.Clear();
        
        if(response.Id == default)
            return new BadRequestApiResult("Could not create a channel");

        return response;




    }

  
}
