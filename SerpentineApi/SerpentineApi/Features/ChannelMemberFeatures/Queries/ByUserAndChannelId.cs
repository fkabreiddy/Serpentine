using System.Text.Json.Serialization;
        using FluentValidation;
        using Microsoft.AspNetCore.Authentication.JwtBearer;
        using Microsoft.AspNetCore.Mvc;
        using Microsoft.EntityFrameworkCore;
        using Scalar.AspNetCore;
        using SerpentineApi.Helpers;
    

        namespace SerpentineApi.Features.ChannelMemberFeatures.Actions;

        public class GetByUserAndChannelIdRequest :  RequestWithUserCredentials, IRequest<OneOf<ChannelMemberResponse, Failure>>
        {
            [FromQuery, JsonPropertyName("channelId"), Required]
            public Ulid ChannelId { get; set; }
        }

        public class GetByUserAndChannelIdRequestValidator : AbstractValidator<GetByUserAndChannelIdRequest>
        {
            public GetByUserAndChannelIdRequestValidator()
            {
                  RuleFor(x => x.ChannelId)
                        .Must(channelId => UlidHelper.IsValid(channelId))
                        .WithMessage("Channel Id must be an valid ULID");
            }
        }

        internal class GetByUserAndChannelIdEndpoint : IEndpoint
        {
            private readonly ChannelMemberEndpointSettings _settings = new();
            public void MapEndpoint(IEndpointRouteBuilder app)
            {
                app.MapGet(
                    _settings.BaseUrl + "/by-user-channel-id",
                    async(
                        [AsParameters] GetByUserAndChannelIdRequest command,
                        EndpointExecutor<GetByUserAndChannelIdEndpoint> executor,
                        CancellationToken cancellationToken,
                        ISender sender,
                        HttpContext context
                    ) => await executor.ExecuteAsync<ChannelMemberResponse>(async () =>
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

                        return ResultsBuilder.Match<ChannelMemberResponse>(new SuccessApiResult<ChannelMemberResponse>(t0));

                    })
                )
                .DisableAntiforgery()
                .RequireAuthorization(JwtBearerDefaults.AuthenticationScheme)
                .RequireCors()
                .Stable()
                .WithOpenApi()
                .WithTags(new[] { nameof(ApiHttpVerbs.Get), nameof(ChannelMember)})
                .Accepts<GetByUserAndChannelIdRequest>(false, ApiContentTypes.ApplicationJson)
                .Produces<SuccessApiResult<ChannelMemberResponse>>(200, ApiContentTypes.ApplicationJson)
                .Produces<BadRequestApiResult>(400, ApiContentTypes.ApplicationJson)
                .Produces<ServerErrorApiResult>(500, ApiContentTypes.ApplicationJson)
                .Produces<ValidationApiResult>(422, ApiContentTypes.ApplicationJson)
                .WithName(nameof(GetByUserAndChannelIdEndpoint))
                .WithDescription("Returns a channel member with a certain ChannelId and UserId. Requires Authorization. Requires CORS.");
            }
        }

        internal class GetByUserAndChannelIdEndpointHandler(SerpentineDbContext context) : IEndpointHandler<GetByUserAndChannelIdRequest, OneOf<ChannelMemberResponse, Failure>>
        {
            public async Task<OneOf<ChannelMemberResponse, Failure>> HandleAsync(GetByUserAndChannelIdRequest request, CancellationToken cancellationToken = default)
            {
                var channel = await context
                            .ChannelMembers
                            .AsNoTracking()
                            .AsSplitQuery()
                            .FirstOrDefaultAsync(ch => ch.ChannelId == request.ChannelId && ch.UserId == request.CurrentUserId, cancellationToken);

                if (channel is null)
                    return new NotFoundApiResult("Membership Not Found");

                return channel.ToResponse();
            }
        }
        