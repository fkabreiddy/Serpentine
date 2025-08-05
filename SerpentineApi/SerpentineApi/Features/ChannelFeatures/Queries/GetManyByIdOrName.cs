using System.Text.Json.Serialization;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using SerpentineApi.DataAccess.Context.EntityExtensions;
using SerpentineApi.Helpers;

namespace SerpentineApi.Features.ChannelFeatures.Queries
{
    public class GetManyByIdOrNameRequest
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

    public class GetManyByIdOrNameRequestValidator : AbstractValidator<GetManyByIdOrNameRequest>
    {
        public GetManyByIdOrNameRequestValidator()
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

    public class GetManyByIdOrNameEndpoint : IEndpoint
    {
        private readonly ChannelEndpointSettings _settings = new();

        public void MapEndpoint(IEndpointRouteBuilder app)
        {
            app.MapGet(
                    _settings.BaseUrl,
                    async (
                        [AsParameters] GetManyByIdOrNameRequest request,
                        ISender sender,
                        CancellationToken cancellationToken,
                        EndpointExecutor<GetManyByIdOrNameEndpoint> executor,
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
                .RequireAuthorization(JwtBearerDefaults.AuthenticationScheme)
                .WithOpenApi()
                .WithTags(new[] { "GET", $"{nameof(Channel)}" })
                .RequireCors()
                .Accepts<GetManyByIdOrNameRequest>(false, "application/json")
                .Produces<SuccessApiResult<List<ChannelResponse>>>(200)
                .Produces<BadRequestApiResult>(400, "application/json")
                .Produces<ServerErrorApiResult>(500, "application/json")
                .Produces<ValidationApiResult>(422, "application/json")
                .WithDescription(
                    $"Return a list of {nameof(ChannelResponse)} by their Id or Name. Requires {nameof(GetManyByIdOrNameRequest)}. Returns a list of {nameof(ChannelResponse)}"
                )
                .WithName(nameof(GetManyByIdOrNameEndpoint));
        }
    }

    internal class GetManyByIdOrNameEndpointHandler(SerpentineDbContext dbContext)
        : IEndpointHandler<GetManyByIdOrNameRequest, OneOf<List<ChannelResponse>, Failure>>
    {
        public async Task<OneOf<List<ChannelResponse>, Failure>> HandleAsync(
            GetManyByIdOrNameRequest request,
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
