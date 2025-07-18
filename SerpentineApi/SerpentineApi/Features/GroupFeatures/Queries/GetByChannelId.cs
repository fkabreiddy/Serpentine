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

namespace SerpentineApi.Features.GroupFeatures.Actions;

public class GetByChannelIdRequest : IRequest<OneOf<List<GroupResponse>, Failure>>
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

public class GetByChannelIdRequestValidator : AbstractValidator<GetByChannelIdRequest>
{
    public GetByChannelIdRequestValidator()
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

internal class GetByChannelIdEndpoint : IEndpoint
{
    private readonly GroupEndpointSettings _settings = new();

    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(
                _settings.BaseUrl + "/by-channel-id",
                async (
                    [AsParameters] GetByChannelIdRequest command,
                    EndpointExecutor<GetByChannelIdEndpoint> executor,
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
            .RequireAuthorization(JwtBearerDefaults.AuthenticationScheme)
            .RequireCors()
            .Experimental()
            .WithOpenApi()
            .Accepts<GetByChannelIdRequest>(false, "multipart/form-data")
            .Produces<SuccessApiResult<List<GroupResponse>>>(200)
            .Produces<BadRequestApiResult>(400, "application/json")
            .Produces<ServerErrorApiResult>(500, "application/json")
            .Produces<ValidationApiResult>(422, "application/json")
            .WithName(nameof(GetByChannelIdEndpoint));
    }
}

internal class GetByChannelIdEndpointHandler(SerpentineDbContext context)
    : IEndpointHandler<GetByChannelIdRequest, OneOf<List<GroupResponse>, Failure>>
{
    public async Task<OneOf<List<GroupResponse>, Failure>> HandleAsync(
        GetByChannelIdRequest request,
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
                group.MyAccess?.LastAccess ?? DateTime.Now,
                cancellationToken
            );

        }

        return groups.Select(g => g.ToResponse()).ToList();
    }
}
