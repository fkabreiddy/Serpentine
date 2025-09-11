using System.ComponentModel;
using System.Text.Json.Serialization;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using SerpentineApi.Helpers;
using SerpentineApi.Hubs;

namespace SerpentineApi.Features.ChannelMemberFeatures.Actions;

public class DeleteChannelMemberRequest : RequestWithUserCredentials, IRequest<OneOf<bool, Failure>>
{
    [
        JsonPropertyName("channelMemberId"),
        FromQuery(Name = "channelMemberId"),
        Description("The id of the membership to kick out")
    ]
    public Ulid? ChannelMemberId { get; set; }
}

public class DeleteChannelMemberRequestValidator : AbstractValidator<DeleteChannelMemberRequest>
{
    public DeleteChannelMemberRequestValidator()
    {
        // Validaciones
    }
}

internal class DeleteChannelMemberEndpoint : IEndpoint
{
    private readonly ChannelMemberEndpointSettings _settings = new();

    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete(
                _settings.BaseUrl,
                async (
                    [AsParameters] DeleteChannelMemberRequest command,
                    EndpointExecutor<DeleteChannelMemberEndpoint> executor,
                    CancellationToken cancellationToken,
                    ILogger<DeleteChannelMemberEndpoint> logger,
                    ISender sender,
                    HttpContext context
                ) =>
                    await executor.ExecuteAsync<bool>(async () =>
                    {
                        command.SetCurrentUserId(
                            UserIdentityRequesterHelper.GetUserIdFromClaims(context.User)
                        );

                        var result = await sender.SendAndValidateAsync(command, cancellationToken);

                        if (result.IsT1)
                        {
                            var failure = result.AsT1;

                            return ResultsBuilder.Match(failure);
                        }

                        var success = result.AsT0;

                        return ResultsBuilder.Match<bool>(new SuccessApiResult<bool>(success));
                    })
            )
            .RequireAuthorization(nameof(AuthorizationPolicies.AllowAllUsers))
            .RequireCors()
            .DisableAntiforgery()
            .Stable()
            .WithOpenApi()
            .WithTags(new[] { nameof(ApiHttpVerbs.Delete), nameof(ChannelMember) })
            .WithName(nameof(DeleteChannelMemberEndpoint))
            .WithDescription(
                $"Deletes a membership from a channel with a certain id. Requires authorization. Requires CORS"
            )
            .Produces<SuccessApiResult<bool>>(200, ApiContentTypes.ApplicationJson)
            .Produces<UnauthorizedApiResult>(401, ApiContentTypes.ApplicationJson)
            .Produces<BadRequestApiResult>(400, ApiContentTypes.ApplicationJson)
            .Produces<ServerErrorApiResult>(500, ApiContentTypes.ApplicationJson)
            .Produces<ValidationApiResult>(422, ApiContentTypes.ApplicationJson)
            .Produces<NotFoundApiResult>(404, ApiContentTypes.ApplicationJson)
            .Accepts<DeleteChannelMemberEndpoint>(false, ApiContentTypes.ApplicationJson);
    }
}

internal class DeleteChannelMemberEndpointHandler(
    SerpentineDbContext context,
    IHubContext<ActiveChannelsHub, IActiveChannelsHub> channelsHub
) : IEndpointHandler<DeleteChannelMemberRequest, OneOf<bool, Failure>>
{
    public async Task<OneOf<bool, Failure>> HandleAsync(
        DeleteChannelMemberRequest request,
        CancellationToken cancellationToken = default
    )
    {
        if (
            await context
                .ChannelMembers.AsNoTracking()
                .FirstOrDefaultAsync(m => m.Id == request.ChannelMemberId)
                is var membership
            && membership is null
        )
        {
            return new NotFoundApiResult("Membership not found");
        }

        if (membership.IsOwner)
        {
            return new ForbiddenApiResult("The owner of the channel cannot be leave the channel");
        }

        var imOwnerOrAdmin = await context.ChannelMembers.AnyAsync(cm =>
            cm.UserId == request.CurrentUserId
            && cm.ChannelId == membership.ChannelId
            && (cm.IsOwner || cm.IsAdmin)
        );

        if (!imOwnerOrAdmin && membership.UserId != request.CurrentUserId)
        {
            return new ForbiddenApiResult("You dont have permisson to remove this membership");
        }

        var deletedRows = await context
            .ChannelMembers.Where(cm => cm.Id == request.ChannelMemberId)
            .ExecuteDeleteAsync(cancellationToken);

        await context.SaveChangesAsync(cancellationToken);

        if (deletedRows >= 1 && imOwnerOrAdmin && membership.UserId != request.CurrentUserId)
        {
            var channels = await context
                .Channels.AsNoTracking()
                .Where(ch => ch.Id == membership.ChannelId)
                .Select(ch => new Channel() { Id = ch.Id, Name = ch.Name })
                .ToListAsync(cancellationToken);

            if (channels.FirstOrDefault() is var channel && channel is not null)
            {
                await channelsHub
                    .Clients.User(membership.UserId.ToString())
                    .SendUserKickedOut(new HubResult<ChannelResponse>(channel.ToResponse()));
            }
        }

        return deletedRows >= 1;
    }
}
