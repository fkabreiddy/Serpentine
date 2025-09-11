using System.Text.Json.Serialization;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Scalar.AspNetCore;
using SerpentineApi.DataAccess.Context.EntityExtensions;
using SerpentineApi.Helpers;

namespace SerpentineApi.Features.GroupFeatures.Actions;

public class GetGroupsByChannelIdRequest : IRequest<OneOf<List<GroupResponse>, Failure>>
{
    [FromQuery, Required, JsonPropertyName("channelId")]
    public Ulid ChannelId { get; set; }

    [JsonPropertyName("skip"), Range(0, int.MaxValue), Required, FromQuery(Name = "skip")]
    public int Skip { get; set; } = 0;

    [JsonPropertyName("take"), Range(1, 5), Required, FromQuery(Name = "take")]
    public int Take { get; set; } = 5;

    [JsonIgnore, BindNever]
    public Ulid CurrentUserId { get; private set; }

    public void SetCurrentUserId(Ulid userId)
    {
        CurrentUserId = userId;
    }
}

public class GetGroupsByChannelIdRequestValidator : AbstractValidator<GetGroupsByChannelIdRequest>
{
    public GetGroupsByChannelIdRequestValidator()
    {
        RuleFor(x => x.Take).InclusiveBetween(1, 5).WithMessage("Take should be between 1 and 5");

        RuleFor(x => x.Skip)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Skip should be greater or equal to 0.");

        RuleFor(x => x.ChannelId)
            .Must(x => UlidHelper.IsValid(x))
            .WithMessage("Channel Id should be an valid Ulid.");
    }
}

internal class GetGroupsByChannelIdEndpoint : IEndpoint
{
    private readonly GroupEndpointSettings _settings = new();

    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(
                _settings.BaseUrl + "/by-channel-id",
                async (
                    [AsParameters] GetGroupsByChannelIdRequest command,
                    EndpointExecutor<GetGroupsByChannelIdEndpoint> executor,
                    CancellationToken cancellationToken,
                    ISender sender,
                    HttpContext context
                ) =>
                    await executor.ExecuteAsync<List<GroupResponse>>(async () =>
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

                        return ResultsBuilder.Match<List<GroupResponse>>(
                            new SuccessApiResult<List<GroupResponse>>(t0)
                        );
                    })
            )
            .DisableAntiforgery()
            .RequireAuthorization(nameof(AuthorizationPolicies.AllowAllUsers))
            .RequireCors()
            .Stable()
            .WithOpenApi()
            .WithTags(new string[] { nameof(ApiHttpVerbs.Get), nameof(Group) })
            .Accepts<GetGroupsByChannelIdRequest>(false, ApiContentTypes.ApplicationJson)
            .Produces<SuccessApiResult<List<GroupResponse>>>(200, ApiContentTypes.ApplicationJson)
            .Produces<BadRequestApiResult>(400, ApiContentTypes.ApplicationJson)
            .Produces<ServerErrorApiResult>(500, ApiContentTypes.ApplicationJson)
            .Produces<ValidationApiResult>(422, ApiContentTypes.ApplicationJson)
            .WithDescription(
                "Returns a list of groups with a certain ChannelId. Require Authorization. Require CORS"
            )
            .WithName(nameof(GetGroupsByChannelIdEndpoint));
    }
}

internal class GetGroupsByChannelIdEndpointHandler(SerpentineDbContext context)
    : IEndpointHandler<GetGroupsByChannelIdRequest, OneOf<List<GroupResponse>, Failure>>
{
    public async Task<OneOf<List<GroupResponse>, Failure>> HandleAsync(
        GetGroupsByChannelIdRequest request,
        CancellationToken cancellationToken = default
    )
    {
        var groups = await context.Groups.GetGroupWithJustMyAccessByChannelId(
            request.ChannelId,
            request.CurrentUserId,
            request.Skip,
            request.Take,
            cancellationToken
        );

        foreach (Group group in groups)
        {
            group.UnreadMessages = await context.Messages.CountUnreadMessagesFromAGroup(
                group.Id,
                request.CurrentUserId,
                group.MyAccess?.LastReadMessageDate ?? group.CreatedAt,
                cancellationToken
            );
        }

        return groups.Select(g => g.ToResponse()).ToList();
    }
}
