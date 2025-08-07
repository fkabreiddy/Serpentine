using System.Text.Json.Serialization;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Scalar.AspNetCore;
using SerpentineApi.DataAccess.Context.EntityExtensions;
using SerpentineApi.Helpers;

namespace SerpentineApi.Features.ChannelFeatures.Queries
{
    public class GetChannelsByFilterRequest
        : RequestWithUserCredentials,
            IRequest<OneOf<List<ChannelResponse>, Failure>>
    {
        [JsonPropertyName("channelId"), FromQuery(Name = "channelIds"), MinLength(1)]
        public Ulid? ChannelId { get; set; }

        [
            JsonPropertyName("channelName"),
            FromQuery(Name = "channelName"),
            MinLength(0),
            MaxLength(100)
        ]
        public string? ChannelName { get; set; }
    }

    public class GetChannelsByFilterRequestValidator : AbstractValidator<GetChannelsByFilterRequest>
    {
        public GetChannelsByFilterRequestValidator()
        {
            RuleFor(x => x.ChannelId)
                .Must(x => x is not null ? UlidHelper.IsValid(x ?? new()) : true)
                .WithMessage("The channel Id must be a valid ULID or null");

            RuleFor(x => x.ChannelName)
                .MinimumLength(0)
                .WithMessage("The channel name must be at least 1 character long or null")
                .MaximumLength(100)
                .WithMessage("The channel name cannot exceed 100 characters or null")
                .Must(x => string.IsNullOrEmpty(x) || (x.Length >= 1 && x.Length <= 100))
                .WithMessage("The channel name must be between 1 and 100 characters or null");
        }
    }

    public class GetChannelsByFilterEndpoint : IEndpoint
    {
        private readonly ChannelEndpointSettings _settings = new();

        public void MapEndpoint(IEndpointRouteBuilder app)
        {
            app.MapGet(
                    _settings.BaseUrl + "/by-filter",
                    async (
                        [AsParameters] GetChannelsByFilterRequest request,
                        ISender sender,
                        CancellationToken cancellationToken,
                        EndpointExecutor<GetChannelsByFilterEndpoint> executor,
                        HttpContext context
                    ) =>
                    {
                        return await executor.ExecuteAsync<List<ChannelResponse>>(async () =>
                        {
                            request.SetCurrentUserId(
                                UserIdentityRequesterHelper.GetUserIdFromClaims(context.User)
                            );
                            var result = await sender.SendAndValidateAsync(
                                request,
                                cancellationToken
                            );

                            if (result.IsT1)
                            {
                                var failure = result.AsT1;
                                return ResultsBuilder.Match<List<ChannelResponse>>(failure);
                            }

                            var channels = result.AsT0;
                            return ResultsBuilder.Match<List<ChannelResponse>>(
                                new SuccessApiResult<List<ChannelResponse>>(channels)
                            );
                        });
                    }
                )
                .DisableAntiforgery()
                .RequireAuthorization(nameof(AuthorizationPolicies.AllowAllUsers))
                .WithOpenApi()
                .Stable()
                .WithTags(new[] { nameof(ApiHttpVerbs.Get), nameof(Channel) })
                .RequireCors()
                .Accepts<GetChannelsByFilterRequest>(false, ApiContentTypes.ApplicationJson)
                .Produces<SuccessApiResult<List<ChannelResponse>>>(200)
                .Produces<BadRequestApiResult>(400, ApiContentTypes.ApplicationJson)
                .Produces<ServerErrorApiResult>(500, ApiContentTypes.ApplicationJson)
                .Produces<ValidationApiResult>(422, ApiContentTypes.ApplicationJson)
                .WithDescription(
                    $"Return a list of channels by name or id. Requires Authorization. Require CORS."
                )
                .WithName(nameof(GetChannelsByFilterEndpoint));
        }
    }

    internal class GetChannelsByFilterEndpointHandler(SerpentineDbContext dbContext)
        : IEndpointHandler<GetChannelsByFilterRequest, OneOf<List<ChannelResponse>, Failure>>
    {
        public async Task<OneOf<List<ChannelResponse>, Failure>> HandleAsync(
            GetChannelsByFilterRequest request,
            CancellationToken cancellationToken
        )
        {
            var channels = await dbContext.Channels.GetChannelsWithJustMyMembershipByNameOrId(
                request.ChannelId,
                request.ChannelName,
                request.CurrentUserId,
                cancellationToken
            );

            return channels.Select(c => c.ToResponse()).ToList();
        }
    }
}
