using System.Text.Json.Serialization;
        using FluentValidation;
        using Microsoft.AspNetCore.Authentication.JwtBearer;
        using Microsoft.AspNetCore.Mvc;
        using Scalar.AspNetCore;
        using SerpentineApi.DataAccess.Context.EntityExtensions;
        using SerpentineApi.Helpers;

        namespace SerpentineApi.Features.GroupFeatures.Actions;

        public class GetByIdRequest : RequestWithUserCredentials, IRequest<OneOf<GroupResponse, Failure>>
        {
            [Required, FromQuery, JsonPropertyName("groupId")]
            public Ulid GroupId { get; set; }

    
            
        }

        public class GetByIdRequestValidator : AbstractValidator<GetByIdRequest>
        {
            public GetByIdRequestValidator()
            {
                RuleFor(x => x.GroupId)
                    .Must(x => UlidHelper.IsValid(x))
                    .WithMessage("Channel Id should be an valid Ulid.");
            }
        }

        internal class GetByIdEndpoint : IEndpoint
        {
            private readonly GroupEndpointSettings _settings = new();
            public void MapEndpoint(IEndpointRouteBuilder app)
            {
                app.MapGet(
                    _settings.BaseUrl + "/by-id",
                    async (
                        [AsParameters] GetByIdRequest command,
                        EndpointExecutor<GetByIdEndpoint> executor,
                        CancellationToken cancellationToken,
                        ISender sender,
                        HttpContext context
                    ) => await executor.ExecuteAsync<GroupResponse>(async () =>
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

                            return ResultsBuilder.Match<GroupResponse>(new SuccessApiResult<GroupResponse>(t0));

                        
                    })
                )
                .DisableAntiforgery()
                .RequireAuthorization(nameof(AuthorizationPolicies.AllowAllUsers))
                .RequireCors()
                .Experimental()
                .WithOpenApi()
                .WithTags(new []{nameof(ApiHttpVerbs.Get), nameof(Group)})
                .Accepts<GetByIdRequest>(false, ApiContentTypes.ApplicationJson)
                .Produces<SuccessApiResult<GroupResponse>>(200, ApiContentTypes.ApplicationJson)
                .Produces<BadRequestApiResult>(400, ApiContentTypes.ApplicationJson)
                .Produces<ServerErrorApiResult>(500, ApiContentTypes.ApplicationJson)
                .Produces<ValidationApiResult>(422, ApiContentTypes.ApplicationJson)
                .Produces<NotFoundApiResult>(404, ApiContentTypes.ApplicationJson)
                .WithDescription("Returns a group with a certain Id. Requires Authorization. Requires CORS.")
                .WithName(nameof(GetByIdEndpoint));
            }
        }

        internal class GetByIdEndpointHandler(SerpentineDbContext context) : IEndpointHandler<GetByIdRequest, OneOf<GroupResponse, Failure>>
        {
            public async Task<OneOf<GroupResponse, Failure>> HandleAsync(GetByIdRequest request, CancellationToken cancellationToken = default)
            {
                var response = await context.Groups.GetGroupWithJustMyAccessByGroupId(request.GroupId, request.CurrentUserId, cancellationToken);

                if (response is null)
                    return new NotFoundApiResult("Group not found");

                response.UnreadMessages = await context.Messages.CountUnreadMessagesFromAGroup(
                    response.Id,
                    request.CurrentUserId,
                    response.MyAccess?.LastAccess ?? DateTime.Now,
                    cancellationToken
                );

                return response.ToResponse();

            
            }
        }
        