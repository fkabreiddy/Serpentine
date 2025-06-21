using System.Text.Json.Serialization;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using SerpentineApi.DataAccess.Context.EntityExtensions;
using SerpentineApi.Helpers;

namespace SerpentineApi.Features.ChannelFeatures.Actions;

public class UpdateChannelRequest : IRequest<OneOf<ChannelResponse, Failure>>
{
    [Required, FromBody, JsonPropertyName("channelId")]
    public Ulid ChannelId { get; set; }
    
    
    
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
    public Ulid CurrentUserId { get; private set; }

    public void SetCurrentUserId(Ulid userId)
    {
        CurrentUserId = userId;
    }

}

public class UpdateChannelRequestValidator : AbstractValidator<UpdateChannelRequest>
{
    public UpdateChannelRequestValidator()
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

internal class UpdateChannelEndpoint : IEndpoint
{
    private readonly ChannelEndpointSettings _settings = new();
    
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut(
                _settings.BaseUrl + "/update",
                async (
                    [FromBody] UpdateChannelRequest command,
                    EndpointExecutor<UpdateChannelEndpoint> executor,
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
            .WithOpenApi()
            .WithTags(new []{"PUT", $"{nameof(Channel)}"})
            .Experimental()
            .Accepts<CreateChannelRequest>(false, "application/json")
            .Produces<SuccessApiResult<ChannelResponse>>(200)
            .Produces<NotFoundApiResult>(404, "application/json")
            .Produces<BadRequestApiResult>(400, "application/json")
            .WithDescription($"Updates a channel in the database. Requires a {nameof(UpdateChannelRequest)}. Returns a {nameof(ChannelResponse)}")
            .Produces<ServerErrorApiResult>(500, "application/json")
            .Produces<ValidationApiResult>(422, "application/json")
            .WithName(nameof(UpdateChannelEndpoint));
    }
}

internal class UpdateChannelRequestChannel(
   SerpentineDbContext context

)
    : IEndpointHandler<UpdateChannelRequest, OneOf<ChannelResponse, Failure>>
{
    public async Task<OneOf<ChannelResponse, Failure>> HandleAsync(
        UpdateChannelRequest request,
        CancellationToken cancellationToken = default
    )
    {
        if (request.CurrentUserId.ToString() == "")
            return new UnauthorizedApiResult("You are trying to create a channel without being logged in");
        
        if (await context.ChannelMembers.AnyAsync(cm =>
                cm.UserId == request.CurrentUserId && cm.ChannelId == request.ChannelId && cm.IsOwner) == false)
        {
           
                return new NotFoundApiResult("Channel not found");
        }

        
        Channel? channel = await context.Channels.FirstOrDefaultAsync(ch => ch.Id == request.ChannelId, cancellationToken);

        if (channel is null)
            return new NotFoundApiResult("Channel not found");

        channel.Update(request);

        await context.SaveChangesAsync(cancellationToken);
        context.ChangeTracker.Clear();
        
        
        Channel? response = await context.Channels.GetChannelsWithJustMyMembershipByChannelId(request.ChannelId, request.CurrentUserId,  cancellationToken);

        if (response is null)
        {
           return new NotFoundApiResult("Channel not found");
        }

        return response.ToResponse();




    }

  
}