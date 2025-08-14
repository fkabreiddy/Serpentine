using System.ComponentModel;
using System.Text.Json.Serialization;
        using FluentValidation;
        using Microsoft.AspNetCore.Authentication.JwtBearer;
        using Microsoft.AspNetCore.Mvc;
        using Microsoft.AspNetCore.Mvc.ModelBinding;
        using Microsoft.AspNetCore.SignalR;
        using Microsoft.EntityFrameworkCore;
        using Scalar.AspNetCore;
        using SerpentineApi.DataAccess.Context.EntityExtensions;
        using SerpentineApi.Helpers;
        using SerpentineApi.Identity;
        using SerpentineApi.Services.CloudinaryStorage;
        using SerpentineApi.Helpers;
        using SerpentineApi.Hubs;

        namespace SerpentineApi.Features.MessageFeatures.Actions;

        public class CreateMessageRequest : RequestWithUserCredentials, IRequest<OneOf<MessageResponse, Failure>>
        {
            [JsonPropertyName("groupId"), FromForm, Required, Description("The id of the group that this message belongs to")]
            public Ulid GroupId { get; set; }
            
            [MaxLength(1000), MinLength(1), Required, JsonPropertyName("content"), FromForm(Name="content"), Description("The content of the message")]
            public string Content { get; set; } = null!;
            
            
            [JsonPropertyName("parentId"), FromForm(Name = "parentId"), Description("The id of the message this message is replying to")]
            public Ulid? ParentId { get; set; }


            [JsonPropertyName("isNotification"), FromForm(Name = "isNotification"),
             Description("Set if the message is a notification with no sender. By default is set to false")]
            public bool IsNotification { get; set; } = false;

        }

        public class CreateRequestValidator : AbstractValidator<CreateMessageRequest>
        {
            public CreateRequestValidator()
            {
                RuleFor(x => x.GroupId)
                    .Must(x => UlidHelper.IsValid(x))
                    .WithMessage("Group Id should be an valid Ulid.");

                RuleFor(x => x.Content)
                    .NotEmpty().WithMessage("Content is required")
                    .MinimumLength(1).WithMessage("Content must be at least 1 character long")
                    .MaximumLength(1000).WithMessage("Content cannot be longer than 1000 characters");


                RuleFor(x => x.ParentId)
                    .Must(id => id == null || id != Ulid.Empty)
                    .WithMessage("ParentId, if provided, must be a valid ULID");
            }
        }

        internal class CreateEndpoint : IEndpoint
        {
            private readonly MessageEndpointSettings _settings = new();
            public void MapEndpoint(IEndpointRouteBuilder app)
            {
                app.MapPost(
                    _settings.BaseUrl ,
                    async(
                        [FromForm] CreateMessageRequest command,
                        EndpointExecutor<CreateEndpoint> executor,
                        CancellationToken cancellationToken,
                        ISender sender,
                        HttpContext context,
                        IHubContext<ActiveChannelsHub, IActiveChannelsHub> channelsHub
                    ) => await executor.ExecuteAsync<MessageResponse>(async () =>
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

                        if (t0.ChannelId is not null)
                        { 
                            await channelsHub.Clients.Group(t0.ChannelId.ToString() ?? string.Empty).SendMessage(new HubResult<MessageResponse>(t0));

                        }
                        
                        return ResultsBuilder.Match<MessageResponse>(new SuccessApiResult<MessageResponse>(t0));

                    })
                )
                .DisableAntiforgery()
                .RequireAuthorization(nameof(AuthorizationPolicies.AllowAllUsers))
                .RequireCors()
                .Experimental()
                .WithOpenApi()
                .WithDescription("Requires Authorization. \n Requires CORS.")
                .WithTags(new string[]{nameof(ApiHttpVerbs.Put), nameof(Message)})
                .Accepts<CreateMessageRequest>(false, ApiContentTypes.MultipartForm)
                .Produces<SuccessApiResult<MessageResponse>>(200, ApiContentTypes.ApplicationJson)
                .Produces<BadRequestApiResult>(400, ApiContentTypes.ApplicationJson)
                .Produces<ServerErrorApiResult>(500, ApiContentTypes.ApplicationJson)
                .Produces<ValidationApiResult>(422, ApiContentTypes.ApplicationJson)
                .WithName(nameof(CreateEndpoint));
            }
        }

        internal class CreateEndpointHandler(
            
            SerpentineDbContext context
            ) : IEndpointHandler<CreateMessageRequest, OneOf<MessageResponse, Failure>>
        {
            public async Task<OneOf<MessageResponse, Failure>> HandleAsync(CreateMessageRequest messageRequest, CancellationToken cancellationToken = default)
            {
                if (await context.Groups.AsNoTracking().FirstOrDefaultAsync(g => g.Id == messageRequest.GroupId, cancellationToken) is
                        var group && group is null)
                {
                    return new NotFoundApiResult("Group not found");
                }



                if (await context.ChannelMembers.AsNoTracking().FirstOrDefaultAsync(
                        cm => cm.ChannelId == group.ChannelId && cm.UserId == messageRequest.CurrentUserId,
                        cancellationToken) is var membership && membership is null)
                {
                    return new ForbiddenApiResult("You are not member of this channel");
                }
                
                if(!group.Public && !(membership.IsAdmin || membership.IsOwner))
                { 
                    return new ForbiddenApiResult("This group is private. You cannot send messages to it");

                }

                var newMessage = Message.Create(messageRequest);
                await context.Messages.AddAsync(newMessage, cancellationToken);
                
                await context.SaveChangesAsync(cancellationToken);

                var result = await context.Messages.GetMessageById(newMessage.Id, cancellationToken);

                if (result is null)
                {
                    return new NotFoundApiResult("We could not find the created message");
                }


                return result.ToResponse();

            }
        }
        