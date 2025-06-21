using System.Text.Json.Serialization;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using SerpentineApi.Helpers;

namespace SerpentineApi.Features.ChannelFeatures.Actions;

public class DeleteChannelRequest : IRequest<OneOf<bool, Failure>>
{
    [Required, 
     JsonPropertyName("channelId"), 
     FromQuery(Name = "channelId")
     
    ]
    public Ulid ChannelId { get; set; }
    
    [BindNever, JsonIgnore]
    public Ulid CurrentUserId { get; private set; }

    public void SetCurrentUserId(Ulid userId)
    {
        CurrentUserId = userId;
    }
    
    
}

public class DeleteChannelRequestValidator : AbstractValidator<DeleteChannelRequest>
{
    public DeleteChannelRequestValidator()
    {
        RuleFor(x => x.ChannelId)
            .NotEmpty().WithMessage("Channel Id should be equal of greater than 0");


    }
}

public class DeleteChannelEndpoint : IEndpoint
{
    private  ChannelEndpointSettings _settings { get; }= new();

    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete(_settings.BaseUrl + "/delete", async (
            [AsParameters] DeleteChannelRequest command,
            EndpointExecutor<DeleteChannelEndpoint> executor,
            HttpContext context,
            CancellationToken cancellationToken,
            ISender sender
        ) =>
        {
            return await executor.ExecuteAsync<bool>(async () =>
            {
                command.SetCurrentUserId(UserIdentityRequesterHelper.GetUserIdFromClaims(context.User));

                var result = await sender.SendAndValidateAsync(command, cancellationToken);

                if (result.IsT1)
                {
                    var error = result.AsT1;
                    return ResultsBuilder.Match<bool>(error);
                }

                var deleted = result.AsT0;
                
                return deleted ? 
                 Results.Ok(new SuccessApiResult<bool>(true)) :
                 ResultsBuilder.Match<bool>(new NotFoundApiResult("Channel not found"));


            });
        })
        .RequireAuthorization(JwtBearerDefaults.AuthenticationScheme)
        .RequireCors()
        .DisableAntiforgery()
        .WithOpenApi()
        .WithTags(new []{"DELETE", $"{nameof(Channel)}"})
        .WithName(nameof(DeleteChannelEndpoint))
        .WithDescription($"Deletes a channel by id. Requires authorization. Requires a {nameof(DeleteChannelRequest)}. Returns a boolean value (true/false)")
        .Produces<SuccessApiResult<bool>>(200, "application/json")
        .Produces<UnauthorizedApiResult>(401, "application/json")
        .Produces<BadRequestApiResult>(400, "application/json")
        .Produces<ServerErrorApiResult>(500, "application/json")
        .Produces<ValidationApiResult>(422, "application/json")
        .Produces<NotFoundApiResult>(404, "application/json")
        .Stable()
        .Accepts<DeleteChannelRequest>(false, "application/json");
    }
}

internal class DeleteChannelEndpointHandler(
    SerpentineDbContext context
    ) 
    : IEndpointHandler<DeleteChannelRequest, OneOf<bool, Failure>>
{
    public async Task<OneOf<bool, Failure>> HandleAsync(DeleteChannelRequest request, CancellationToken cancellationToken)
    {
        if (request.CurrentUserId.ToString() == "")
            return new UnauthorizedApiResult("You are not allowed to do this action");
        
        var userHasPermission = await context.ChannelMembers.AnyAsync(x => x.UserId == request.CurrentUserId && x.ChannelId == request.ChannelId && x.IsOwner, cancellationToken);

        if (!userHasPermission)
            return new NotFoundApiResult("The channel you are looking for do not exist or you don't have the permission to delete it");
        

        var deletedRows = await context.Channels.Where(ch => ch.Id == request.ChannelId).ExecuteDeleteAsync(cancellationToken);
        await context.SaveChangesAsync(cancellationToken);

        return deletedRows >= 1;
        

    }
}