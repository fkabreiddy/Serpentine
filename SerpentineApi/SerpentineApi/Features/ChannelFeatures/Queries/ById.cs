using System.Text.Json.Serialization;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Scalar.AspNetCore;
using SerpentineApi.DataAccess.Context.EntityExtensions;
using SerpentineApi.Helpers;

namespace SerpentineApi.Features.ChannelFeatures.Queries;

public class GetChannelByIdRequest
    : RequestWithUserCredentials,
        IRequest<OneOf<ChannelResponse, Failure>>
{
    [JsonPropertyName("channelId"), FromQuery(Name = "channelId"), Required, MinLength(1)]
    public Ulid ChannelId { get; set; }
}

public class GetChannelByIdRequestValidator : AbstractValidator<GetChannelByIdRequest>
{
    public GetChannelByIdRequestValidator()
    {
        RuleFor(x => x.ChannelId)
            .Must(x => UlidHelper.IsValid(x))
            .WithMessage("The channel Id must be an valid ULID");
    }
}

public class GetChannelByIdEndpoint : IEndpoint
{
    public ChannelEndpointSettings _settings = new();

    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(
                _settings.BaseUrl,
                async (
                    [AsParameters] GetChannelByIdRequest request,
                    ISender sender,
                    CancellationToken cancellationToken,
                    EndpointExecutor<GetChannelByIdEndpoint> executor,
                    HttpContext context
                ) =>
                {
                    return await executor.ExecuteAsync<ChannelResponse>(async () =>
                    {
                        request.SetCurrentUserId(
                            UserIdentityRequesterHelper.GetUserIdFromClaims(context.User)
                        );
                        var result = await sender.SendAndValidateAsync(request, cancellationToken);

                        if (result.IsT1)
                        {
                            var t1 = result.AsT1;

                            return ResultsBuilder.Match<ChannelResponse>(t1);
                        }

                        var t0 = result.AsT0;

                        return ResultsBuilder.Match<ChannelResponse>(
                            new SuccessApiResult<ChannelResponse>(t0)
                        );
                    });
                }
            )
            .RequireAuthorization(nameof(AuthorizationPolicies.AllowAllUsers))
            .RequireCors()
            .Stable()
            .WithOpenApi()
            .WithTags(new[] { nameof(ApiHttpVerbs.Get), nameof(Channel) })
            .DisableAntiforgery()
            .Accepts<GetChannelByIdRequest>(ApiContentTypes.ApplicationJson)
            .Produces<SuccessApiResult<ChannelResponse>>(200, ApiContentTypes.ApplicationJson)
            .Produces<BadRequestApiResult>(400, ApiContentTypes.ApplicationJson)
            .Produces<ServerErrorApiResult>(500, ApiContentTypes.ApplicationJson)
            .Produces<NotFoundApiResult>(404, ApiContentTypes.ApplicationJson)
            .Produces<ValidationApiResult>(409, ApiContentTypes.ApplicationJson)
            .WithName(nameof(GetChannelByIdEndpoint))
            .WithDescription(
                $"Returns a Channel. Requires Authorization. Requires CORS"
            );
    }
}

internal class GetChannelByIdEndpointHandler(SerpentineDbContext context)
    : IEndpointHandler<GetChannelByIdRequest, OneOf<ChannelResponse, Failure>>
{
    public async Task<OneOf<ChannelResponse, Failure>> HandleAsync(
        GetChannelByIdRequest request,
        CancellationToken cancellationToken
    )
    {

        Channel? channel = await context.Channels.GetChannelsWithJustMyMembershipByChannelId(
            request.ChannelId,
            request.CurrentUserId,
            cancellationToken
        );

        if (channel is null)
            return new NotFoundApiResult($"Channel with the id {request.ChannelId} not found");

      
        return channel.ToResponse();
    }
}
