using System.Text.Json.Serialization;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using SerpentineApi.Helpers;

namespace SerpentineApi.Features.ChannelMemberFeatures.Queries;

public class GetChannelMembersByChannelIdRequest
    : IRequest<OneOf<List<ChannelMemberResponse>, Failure>>
{
    [JsonPropertyName("channelId"), MinLength(1), Required, FromQuery(Name = "channelId")]
    public Ulid ChannelId { get; set; }

    [Required, FromQuery(Name = "take"), JsonPropertyName("take"), Range(1, 5)]
    public int Take { get; set; } = 0;

    [Required, FromQuery(Name = "skip"), JsonPropertyName("skip"), Range(0, int.MaxValue)]
    public int Skip { get; set; } = 0;
}

public class GetChannelMembersByChannelIdRequestValidator
    : AbstractValidator<GetChannelMembersByChannelIdRequest>
{
    public GetChannelMembersByChannelIdRequestValidator()
    {
        RuleFor(x => x.ChannelId)
            .Must(channelId => UlidHelper.IsValid(channelId))
            .WithMessage("Channel Id must be an valid ULID");

        RuleFor(x => x.Take).InclusiveBetween(1, 5).WithMessage("Take should be between 1 and 5");

        RuleFor(x => x.Skip)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Skip should be greater or equal to 0.");
    }
}

internal class GetChannelMemberByChannelIdEndpoint : IEndpoint
{
    private readonly ChannelMemberEndpointSettings _settings = new();

    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(
                _settings.BaseUrl + "/by-channel-id",
                async (
                    [AsParameters] GetChannelMembersByChannelIdRequest command,
                    EndpointExecutor<GetChannelMemberByChannelIdEndpoint> executor,
                    CancellationToken cancellationToken,
                    ISender sender
                ) =>
                {
                    return await executor.ExecuteAsync<List<ChannelMemberResponse>>(async () =>
                    {
                        var result = await sender.SendAndValidateAsync(command, cancellationToken);
                        if (result.IsT1)
                        {
                            var error = result.AsT1;

                            return ResultsBuilder.Match(error);
                        }

                        var channelMembers = result.AsT0;
                        return Results.Ok(
                            new SuccessApiResult<List<ChannelMemberResponse>>(channelMembers)
                        );
                    });
                }
            )
            .DisableAntiforgery()
            .RequireAuthorization(JwtBearerDefaults.AuthenticationScheme)
            .Stable()
            .WithOpenApi()
            .WithTags(new[] { nameof(ApiHttpVerbs.Get), nameof(ChannelMember) })
            .RequireCors()
            .Accepts<GetChannelMembersByChannelIdRequest>(false, ApiContentTypes.ApplicationJson)
            .Produces<SuccessApiResult<List<ChannelResponse>>>(200, ApiContentTypes.ApplicationJson)
            .Produces<BadRequestApiResult>(400, ApiContentTypes.ApplicationJson)
            .Produces<ServerErrorApiResult>(500, ApiContentTypes.ApplicationJson)
            .Produces<ValidationApiResult>(422, ApiContentTypes.ApplicationJson)
            .WithDescription(
                $"Return a list of channel members with a certain ChannelId. Requires Authorization. Requires CORS."
            )
            .WithName(nameof(GetChannelMemberByChannelIdEndpoint));
    }
}

internal class GetByUserIdEndpointHandler(SerpentineDbContext context)
    : IEndpointHandler<
        GetChannelMembersByChannelIdRequest,
        OneOf<List<ChannelMemberResponse>, Failure>
    >
{
    public async Task<OneOf<List<ChannelMemberResponse>, Failure>> HandleAsync(
        GetChannelMembersByChannelIdRequest request,
        CancellationToken cancellationToken = default
    )
    {
        List<ChannelMember> channels = await context
            .ChannelMembers.AsNoTracking()
            .AsSplitQuery()
            .Where(ch => ch.ChannelId == request.ChannelId)
            .OrderBy(ch => ch.Id)
            .Skip(request.Skip)
            .Take(request.Take)
            .ToListAsync(cancellationToken);

        return channels.Select(ch => ch.ToResponse()).ToList();
    }
}
