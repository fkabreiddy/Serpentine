using System.Text.Json.Serialization;
        using FluentValidation;
        using Microsoft.AspNetCore.Authentication.JwtBearer;
        using Microsoft.AspNetCore.Mvc;
        using Microsoft.AspNetCore.SignalR;
        using Microsoft.EntityFrameworkCore;
        using Scalar.AspNetCore;
        using SerpentineApi.Features.ChannelBan;
        using SerpentineApi.Helpers;
        using SerpentineApi.Hubs;

        namespace SerpentineApi.Features.ChannelMemberFeatures.Actions;

        public class CreateChannelBanRequest : RequestWithUserCredentials, IRequest<OneOf<ChannelBanResponse, Failure>>
        {

            [JsonPropertyName("channelId"), Required, FromBody]
            public Ulid ChannelId { get; set; }

            [JsonPropertyName("userId"), Required, FromBody]
            public Ulid UserId { get; set; }

            [Required, JsonPropertyName("reason"), MaxLength(300), MinLength(5)]
             public string Reason { get; set; } = "";    
        }

    public class CreateChannelBanRequestValidator : AbstractValidator<CreateChannelBanRequest>
    {
        public CreateChannelBanRequestValidator()
        {
            RuleFor(x => x.ChannelId)
            .Must(x => UlidHelper.IsValid(x))
            .WithMessage("The id of the channel must not be empty.");

            RuleFor(x => x.UserId)
            .Must(x => UlidHelper.IsValid(x))
            .WithMessage("The id of the user must not be empty.");

            RuleFor(x => x.Reason)
            .NotNull().WithMessage("There must be valid reason to ban this user")
            .MaximumLength(300).WithMessage("The reason for baning this user must not exceed 300 characters")
            .MinimumLength(5).WithMessage("There reason must be larger than 5 characters");
        }

        
            
        }

        internal class CreateChannelBanEndpoint : IEndpoint
        {
            private readonly ChannelBanEndpointSettings _settings = new();
            public void MapEndpoint(IEndpointRouteBuilder app)
            {
                app.MapPost(
                    _settings.BaseUrl + "/create",
                    async (
                        [FromBody] CreateChannelBanRequest command,
                        EndpointExecutor<CreateChannelBanEndpoint> executor,
                        CancellationToken cancellationToken,
                        ISender sender,
                        HttpContext context,
                        IHubContext<ActiveChannelsHub, IActiveChannelsHub> activeUsersHub

                    ) => await executor.ExecuteAsync<ChannelBanResponse>(async () =>
                    {
                        {

                            command.SetCurrentUserId(UserIdentityRequesterHelper.GetUserIdFromClaims(context.User));
                            var result = await sender.SendAndValidateAsync(command, cancellationToken);

                            if (result.IsT1)
                            {
                                var t1 = result.AsT1;

                                return ResultsBuilder.Match(t1);

                            }

                            var t0 = result.AsT0;
                            await activeUsersHub.Clients.User(t0.UserId.ToString())
                                .SendUserBanned(new HubResult<ChannelBanResponse>(t0));
                            return ResultsBuilder.Match<ChannelBanResponse>(new SuccessApiResult<ChannelBanResponse>(t0));

                        }
                    })
                )
            .DisableAntiforgery()
            .RequireAuthorization(JwtBearerDefaults.AuthenticationScheme)
            .RequireCors()
            .Stable()
            .WithOpenApi()
            .Accepts<CreateChannelBanRequest>(false, "application/json")
            .Produces<SuccessApiResult<bool>>(200, "application/json")
            .Produces<UnauthorizedApiResult>(400, "application/json")
            .Produces<BadRequestApiResult>(400, "application/json")
            .Produces<ServerErrorApiResult>(500, "application/json")
            .Produces<ConflictApiResult>(409, "application/json")
            .Produces<ValidationApiResult>(422, "application/json")
            .Produces<NotFoundApiResult>(404, "application/json")
            .WithTags(new string[]{"POST", nameof(ChannelBan)})
            .WithName(nameof(CreateChannelBanEndpoint))
            .WithDescription("Ban an user from a channel. Requires Authorization. Requires CORS");
            }
        }

        internal class CreateChannelBanEndpointHandler(SerpentineDbContext context) : IEndpointHandler<CreateChannelBanRequest, OneOf<ChannelBanResponse, Failure>>
        {
            public async Task<OneOf<ChannelBanResponse, Failure>> HandleAsync(CreateChannelBanRequest request, CancellationToken cancellationToken = default)
            {
                if (await context.ChannelBans.AnyAsync(
                        x => x.ChannelId == request.ChannelId && x.UserId == request.UserId, cancellationToken))
                    return new ConflictApiResult("This user is already banned");

                if (!await context.ChannelMembers.AnyAsync(
                        x => x.ChannelId == request.ChannelId && x.UserId == request.CurrentUserId &&
                             (x.IsAdmin || x.IsOwner), cancellationToken))
                    return new ForbiddenApiResult("You dont have permisson to ban this user");

                 var membership = await context.ChannelMembers.AsNoTracking().FirstOrDefaultAsync(x => x.ChannelId == request.ChannelId && x.UserId == request.UserId, cancellationToken);

                if (membership is null)
                {
                    return new NotFoundApiResult("User membership not found");
                }

                if (membership.IsAdmin || membership.IsOwner)
                {      
                      return new ForbiddenApiResult("You cant ban an administrator or the owner of the channel");

                    
                }



                
                using var transaction = await context.Database.BeginTransactionAsync(cancellationToken);

                try
                {
                    var channelBan = DataAccess.Models.ChannelBan.Create(request);
                    
                    var insertion = await context.ChannelBans.AddAsync(channelBan, cancellationToken);
                    await context.SaveChangesAsync(cancellationToken);
                    if ( insertion.Entity.Id == Ulid.Empty)
                    {
                        await transaction.RollbackAsync(cancellationToken);
                        return new BadRequestApiResult("We could not ban this user");
                    }

                    var deletedRows = await context.ChannelMembers
                        .Where(cm => cm.UserId == request.UserId && cm.ChannelId == request.ChannelId)
                        .ExecuteDeleteAsync(cancellationToken);
                    
                    await context.SaveChangesAsync(cancellationToken);

                    if(deletedRows <= 0)
                    {
                        await transaction.RollbackAsync(cancellationToken);
                        return new NotFoundApiResult("We could not ban this user");
                    }

                    await transaction.CommitAsync(cancellationToken);
                    return channelBan.ToResponse();



                }
                catch(Exception)
                {
                    await transaction.RollbackAsync(cancellationToken);
                    throw;

                }
            }
        }
        