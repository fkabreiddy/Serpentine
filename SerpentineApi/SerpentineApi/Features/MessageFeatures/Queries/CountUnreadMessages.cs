using System.ComponentModel;
using System.Text.Json.Serialization;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using SerpentineApi.Helpers;

namespace SerpentineApi.Features.MessageFeatures.Actions;

public class GetCountUnreadMessagesRequest
    : RequestWithUserCredentials,
        IRequest<OneOf<int, Failure>>
{
    [
        FromQuery(Name = "groupId"),
        JsonPropertyName("groupId"),
        Description("The group where messages are going to be trieved"),
        Required
    ]
    public Ulid GroupId { get; set; }
}

public class GetCountUnreadMessagesRequestValidator
    : AbstractValidator<GetCountUnreadMessagesRequest>
{
    public GetCountUnreadMessagesRequestValidator()
    {
        RuleFor(x => x.GroupId)
            .Must(x => UlidHelper.IsValid(x))
            .WithMessage("Group Id should be an valid Ulid.");
    }
}

internal class GetCountUnreadMessagesEndpoint : IEndpoint
{
    private readonly MessageEndpointSettings _settings = new();

    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(
                _settings.BaseUrl + "/count-unread-by-group-id",
                async (
                    [AsParameters] GetCountUnreadMessagesRequest command,
                    EndpointExecutor<GetCountUnreadMessagesEndpoint> executor,
                    CancellationToken cancellationToken,
                    ISender sender,
                    HttpContext context
                ) =>
                    await executor.ExecuteAsync<int>(async () =>
                    {
                        {
                            command.SetCurrentUserId(
                                UserIdentityRequesterHelper.GetUserIdFromClaims(context.User)
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

                            return ResultsBuilder.Match<int>(new SuccessApiResult<int>(t0));
                        }
                    })
            )
            .DisableAntiforgery()
            .RequireAuthorization(nameof(AuthorizationPolicies.AllowAllUsers))
            .RequireCors()
            .Experimental()
            .WithOpenApi()
            .WithDescription(
                "Returns a number of unread messages by an user id from a group. Requires Authorization. \n Requires CORS."
            )
            .WithTags(new string[] { nameof(ApiHttpVerbs.Get), nameof(Message) })
            .Accepts<GetCountUnreadMessagesRequest>(false, ApiContentTypes.ApplicationJson)
            .Produces<SuccessApiResult<int>>(200, ApiContentTypes.ApplicationJson)
            .Produces<BadRequestApiResult>(400, ApiContentTypes.ApplicationJson)
            .Produces<ServerErrorApiResult>(500, ApiContentTypes.ApplicationJson)
            .Produces<ValidationApiResult>(422, ApiContentTypes.ApplicationJson)
            .WithName(nameof(GetCountUnreadMessagesEndpoint));
    }
}

internal class GetCountUnreadMessagesEndpointHandler(SerpentineDbContext context)
    : IEndpointHandler<GetCountUnreadMessagesRequest, OneOf<int, Failure>>
{
    public async Task<OneOf<int, Failure>> HandleAsync(
        GetCountUnreadMessagesRequest request,
        CancellationToken cancellationToken = default
    )
    {
        if (
            await context.GroupAccesses.FirstOrDefaultAsync(g =>
                g.GroupId == request.GroupId && g.UserId == request.CurrentUserId
            )
                is var access
            && access is null
        )
        {
            return 0;
        }

        return await context.Messages.CountAsync(m => m.CreatedAt > access.LastReadMessageDate);
    }
}
