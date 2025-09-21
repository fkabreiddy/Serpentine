using System.ComponentModel;
using System.Text.Json.Serialization;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using SerpentineApi.Helpers;
using SerpentineApi.Hubs;

namespace SerpentineApi.Features.GroupFeatures.Actions;

public class DeleteGroupRequest : RequestWithUserCredentials, IRequest<OneOf<bool, Failure>>
{
    [
        Required,
        JsonPropertyName("groupId"),
        FromQuery(Name = "groupId"),
        Description("The id of the group to delete")
    ]
    public Ulid GroupId { get; set; }
}

public class DeleteGroupRequestValidator : AbstractValidator<DeleteGroupRequest>
{
    public DeleteGroupRequestValidator()
    {
        RuleFor(x => x.GroupId)
            .Must(groupId => UlidHelper.IsValid(groupId))
            .WithMessage("The group id must be a valid ULID");
    }
}

internal class DeleteGroupEndpoint : IEndpoint
{
    private readonly GroupEndpointSettings _settings = new();

    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete(
                _settings.BaseUrl,
                async (
                    [AsParameters] DeleteGroupRequest command,
                    EndpointExecutor<DeleteGroupEndpoint> executor,
                    CancellationToken cancellationToken,
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
                            var t1 = result.AsT1;

                            return ResultsBuilder.Match(t1);
                        }

                        var t0 = result.AsT0;

                        return ResultsBuilder.Match<bool>(new SuccessApiResult<bool>(t0));
                    })
            )
            .DisableAntiforgery()
            .RequireAuthorization(nameof(AuthorizationPolicies.AllowAllUsers))
            .RequireCors()
            .Experimental()
            .WithOpenApi()
            .WithDescription(
                "Deletes an group with a certain id.Requires Authorization. \n Requires CORS."
            )
            .WithTags(new string[] { nameof(ApiHttpVerbs.Delete), nameof(Group) })
            .Accepts<DeleteGroupRequest>(false, ApiContentTypes.ApplicationJson)
            .Produces<SuccessApiResult<bool>>(200, ApiContentTypes.ApplicationJson)
            .Produces<BadRequestApiResult>(400, ApiContentTypes.ApplicationJson)
            .Produces<ServerErrorApiResult>(500, ApiContentTypes.ApplicationJson)
            .Produces<NotFoundApiResult>(404, ApiContentTypes.ApplicationJson)
            .Produces<ForbiddenApiResult>(403, ApiContentTypes.ApplicationJson)
            .Produces<ValidationApiResult>(422, ApiContentTypes.ApplicationJson)
            .WithName(nameof(DeleteGroupEndpoint));
    }
}

internal class DeleteGroupEndpointHandler(SerpentineDbContext context, IHubContext<ActiveChannelsHub, IActiveChannelsHub> activeChannelsHub)
    : IEndpointHandler<DeleteGroupRequest, OneOf<bool, Failure>>
{
    public async Task<OneOf<bool, Failure>> HandleAsync(
        DeleteGroupRequest request,
        CancellationToken cancellationToken = default
    )
    {
        if (
            await context
                .Groups.AsNoTracking()
                .AsSplitQuery()
                .FirstOrDefaultAsync(g => g.Id == request.GroupId, cancellationToken)
                is var group
            && group is null
        )
        {
            return new NotFoundApiResult("Group not found");
        }

        if (
            await context
                .ChannelMembers.AsNoTracking()
                .AsSplitQuery()
                .FirstOrDefaultAsync(
                    cm => cm.ChannelId == group.ChannelId && cm.UserId == request.CurrentUserId,
                    cancellationToken
                )
                is var membership
            && membership is null
        )
        {
            return new NotFoundApiResult("Seems you dont belong to this channel");
        }

        if (!membership.IsOwner && !membership.IsAdmin)
        {
            return new ForbiddenApiResult("You don't have permission to update this group");
        }

        var deletedRows = await context.Groups
                                        .Where(g => g.Id == group.Id)
                                        .ExecuteDeleteAsync(cancellationToken);


        if (deletedRows > 0)
        {
            await activeChannelsHub.Clients.Group(group.ChannelId.ToString()).SendGroupDeleted(new HubResult<string>(group.Id.ToString()));
        }


        return deletedRows > 0;
    }
}
