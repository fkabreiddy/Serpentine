using System.ComponentModel;
using System.Text.Json.Serialization;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using SerpentineApi.DataAccess.Context.EntityExtensions;
using SerpentineApi.Helpers;
using SerpentineApi.Helpers;
using SerpentineApi.Identity;
using SerpentineApi.Services.CloudinaryStorage;
using SerpentineApi.Utilities;

namespace SerpentineApi.Features.MessageFeatures.Actions;

public class GetMessagesByGroupIdRequest
    : RequestWithUserCredentials,
        IRequest<OneOf<List<MessageResponse>, Failure>>
{
    [
        JsonPropertyName("groupId"),
        FromQuery(Name = "groupId"),
        Description("The id of the group you want to get the messages from"),
        Required
    ]
    public Ulid GroupId { get; set; }

    [
        JsonPropertyName("take"),
        Range(1, 15),
        FromQuery(Name = "take"),
        Description("The amount of messages to fetch")
    ]
    public int Take { get; set; } = 15;

    [
        JsonPropertyName("skip"),
        Range(1, int.MaxValue),
        FromQuery(Name = "skip"),
        Description("The amount of messages to skip after the previous fetch")
    ]
    public int Skip { get; set; } = 0;

    [
        Required,
        JsonPropertyName("after"),
        Range(1, int.MaxValue),
        FromQuery(Name = "after"),
        Description(
            "Whether to fetch messages after the last index. By default it fetches messages before the index."
        )
    ]
    public bool After { get; set; } = false;

    [
        JsonPropertyName("indexDate"),
        FromQuery(Name = "indexDate"),
        Description("The date of the index to reference from where to start fetching messages.")
    ]
    public DateTime? IndexDate { get; set; } = DateTime.UtcNow;
}

public class GetMessagesByGroupIdRequestValidator : AbstractValidator<GetMessagesByGroupIdRequest>
{
    public GetMessagesByGroupIdRequestValidator()
    {
        RuleFor(x => x.GroupId)
            .Must(x => UlidHelper.IsValid(x))
            .WithMessage("Group Id should be an valid Ulid.");

        RuleFor(x => x.Take).InclusiveBetween(1, 15).WithMessage("Take must be between 1 and 15.");

        RuleFor(x => x.Skip).GreaterThanOrEqualTo(0).WithMessage("Skip must be zero or greater.");
    }
}

internal class GetMessagesByGroupIdEndpoint : IEndpoint
{
    private readonly MessageEndpointSettings _settings = new();

    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(
                _settings.BaseUrl + "/by-group-id",
                async (
                    [AsParameters] GetMessagesByGroupIdRequest command,
                    EndpointExecutor<GetMessagesByGroupIdEndpoint> executor,
                    CancellationToken cancellationToken,
                    ISender sender,
                    HttpContext context
                ) =>
                    await executor.ExecuteAsync<List<MessageResponse>>(async () =>
                    {
                        {
                            command.SetCurrentUserId(
                                UserIdentityRequesterHelper.GetUserIdFromClaims(context.User)
                            );
                            command.SetCurrentUserAge(
                                UserIdentityRequesterHelper.GetUserAgeFromClaims(context.User)
                            );
                            var result = await sender.SendAndValidateAsync(
                                command,
                                cancellationToken
                            );

                            if (result.IsT1)
                            {
                                var t1 = result.AsT1;

                                return ResultsBuilder.Match(t1);
                            }

                            var t0 = result.AsT0;

                            return ResultsBuilder.Match<List<MessageResponse>>(
                                new SuccessApiResult<List<MessageResponse>>(t0)
                            );
                        }
                    })
            )
            .DisableAntiforgery()
            .RequireAuthorization(nameof(AuthorizationPolicies.AllowAllUsers))
            .RequireCors()
            .Experimental()
            .WithOpenApi()
            .WithDescription(
                "Fetches a list of messages with a certain group id. Requires Authorization. \n Requires CORS."
            )
            .WithTags(new string[] { nameof(ApiHttpVerbs.Get), nameof(Message) })
            .Accepts<GetMessagesByGroupIdRequest>(false, ApiContentTypes.ApplicationJson)
            .Produces<SuccessApiResult<List<MessageResponse>>>(200, ApiContentTypes.ApplicationJson)
            .Produces<BadRequestApiResult>(400, ApiContentTypes.ApplicationJson)
            .Produces<ServerErrorApiResult>(500, ApiContentTypes.ApplicationJson)
            .Produces<ValidationApiResult>(422, ApiContentTypes.ApplicationJson)
            .Produces<NotFoundApiResult>(404, ApiContentTypes.ApplicationJson)
            .Produces<ForbiddenApiResult>(403, ApiContentTypes.ApplicationJson)
            .WithName(nameof(GetMessagesByGroupIdEndpoint));
    }
}

internal class GetMessagesByGroupIdEndpointHandler(SerpentineDbContext context)
    : IEndpointHandler<GetMessagesByGroupIdRequest, OneOf<List<MessageResponse>, Failure>>
{
    public async Task<OneOf<List<MessageResponse>, Failure>> HandleAsync(
        GetMessagesByGroupIdRequest request,
        CancellationToken cancellationToken = default
    )
    {
        var group = await context
            .Groups.AsNoTracking()
            .FirstOrDefaultAsync(g => g.Id == request.GroupId);

        if (group is null)
        {
            return new NotFoundApiResult(
                "The gorup you are trying to send the message no longer exist"
            );
        }

        if (group.RequiresOverage && request.CurrentUserAge < 18)
        {
            return new ForbiddenApiResult(
                "This group requires you to be overage. You dont have permission to access this group messages"
            );
        }

        if (
            await context
                .ChannelMembers.AsNoTracking()
                .FirstOrDefaultAsync(
                    cm => cm.ChannelId == group.ChannelId && cm.UserId == request.CurrentUserId,
                    cancellationToken
                )
                is var membership
            && membership is null
        )
        {
            return new ForbiddenApiResult("You do not belong to this channel");
        }

        if (!group.Public && (!membership.IsOwner && !membership.IsAdmin))
        {
            return new ForbiddenApiResult("You don't have permission access this group");
        }

        if (request.After)
        {
            return await context.Messages.GetMessagesByGroupIdAfter(
                request.GroupId,
                request.Take,
                request.IndexDate ?? DateTime.UtcNow,
                cancellationToken
            );
        }
        else
        {
            return await context.Messages.GetMessagesByGroupIdBefore(
                request.GroupId,
                request.Take,
                request.IndexDate ?? DateTime.UtcNow,
                cancellationToken
            );
        }
    }
}
