using System.Text.Json.Serialization;
        using FluentValidation;
        using Microsoft.AspNetCore.Authentication.JwtBearer;
        using Microsoft.AspNetCore.Mvc;
        using Microsoft.AspNetCore.Mvc.ModelBinding;
        using Microsoft.EntityFrameworkCore;
        using Scalar.AspNetCore;
        using SerpentineApi.DataAccess.Context.EntityExtensions;
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
                .Experimental()
                .WithOpenApi()
                .Accepts<GetByUserAndChannelIdRequest>(false, "multipart/form-data")
                .Produces<SuccessApiResult<ChannelMemberResponse>>(200)
                .Produces<BadRequestApiResult>(400, "application/json")
                .Produces<ServerErrorApiResult>(500, "application/json")
                .Produces<ValidationApiResult>(422, "application/json")
                .WithName(nameof(GetByUserAndChannelIdEndpoint));
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
        