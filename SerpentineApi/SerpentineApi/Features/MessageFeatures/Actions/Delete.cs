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
using SerpentineApi.Helpers;
using SerpentineApi.Hubs;
using SerpentineApi.Identity;
using SerpentineApi.Services.CloudinaryStorage;

namespace SerpentineApi.Features.MessageFeatures.Actions;

public class DeleteMessageRequest : RequestWithUserCredentials, IRequest<OneOf<string, Failure>>
{
    [Required, JsonPropertyName("messageId"), Description("The ID of the message to delete.")]
    public Ulid MessageId { get; set; }
}

public class DeleteMessageRequestValidator : AbstractValidator<DeleteMessageRequest>
{
    public DeleteMessageRequestValidator()
    {
        RuleFor(x => x.MessageId)
            .Must(x => UlidHelper.IsValid(x))
            .WithMessage("Message Id should be an valid Ulid.");
    }
}

internal class DeleteMessageEndpoint : IEndpoint
{
    private readonly MessageEndpointSettings _settings = new();

    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete(
                _settings.BaseUrl,
                async (
                    [AsParameters] DeleteMessageRequest command,
                    EndpointExecutor<DeleteMessageEndpoint> executor,
                    CancellationToken cancellationToken,
                    ISender sender,
                    HttpContext context
                ) =>
                    await executor.ExecuteAsync<string>(async () =>
                    {
                        {
                            command.SetCurrentUserId(
                                UserIdentityRequesterHelper.GetUserIdFromClaims(context.User)
                            );
                            var result = await sender.SendAndValidateAsync(
                                command,
                                cancellationToken
                            );

                            if (result.IsT1)
                            {
                                var t1 = result.AsT1;

                                return ResultsBuilder.Match(t1);
                            }

                            var t0 = result.AsT0;

                            return ResultsBuilder.Match<string>(new SuccessApiResult<string>(t0));
                        }
                    })
            )
            .DisableAntiforgery()
            .RequireAuthorization(nameof(AuthorizationPolicies.AllowAllUsers))
            .RequireCors()
            .Experimental()
            .WithOpenApi()
            .WithDescription(
                "Deletes a channel with a certain id.Requires Authorization. \n Requires CORS."
            )
            .WithTags(new string[] { nameof(ApiHttpVerbs.Delete), nameof(Message) })
            .Accepts<DeleteMessageRequest>(false, ApiContentTypes.ApplicationJson)
            .Produces<SuccessApiResult<string>>(200, ApiContentTypes.ApplicationJson)
            .Produces<BadRequestApiResult>(400, ApiContentTypes.ApplicationJson)
            .Produces<ServerErrorApiResult>(500, ApiContentTypes.ApplicationJson)
            .Produces<NotFoundApiResult>(404, ApiContentTypes.ApplicationJson)
            .Produces<ForbiddenApiResult>(403, ApiContentTypes.ApplicationJson)
            .Produces<ValidationApiResult>(422, ApiContentTypes.ApplicationJson)
            .WithName(nameof(DeleteMessageEndpoint));
    }
}

internal class DeleteMessageEndpointHandler(
    SerpentineDbContext context,
    IHubContext<ActiveChannelsHub, IActiveChannelsHub> channelsHub
) : IEndpointHandler<DeleteMessageRequest, OneOf<string, Failure>>
{
    public async Task<OneOf<string, Failure>> HandleAsync(
        DeleteMessageRequest request,
        CancellationToken cancellationToken = default
    )
    {
        bool hasPermission = false;

        var channelId = await context
            .Messages.AsNoTracking()
            .IgnoreAutoIncludes()
            .Where(m => m.Id == request.MessageId)
            .Select(m => m.Group.ChannelId)
            .FirstOrDefaultAsync(cancellationToken);

        if (!UlidHelper.IsValid(channelId))
        {
            return new NotFoundApiResult("Message not found");
        }

        if (
            !await context.Messages.AnyAsync(
                m =>
                    m.Id == request.MessageId
                    && m.Sender != null
                    && m.SenderId == request.CurrentUserId,
                cancellationToken
            )
        )
        {
            //if the current user is not the sender and a channel id is provided we check if the person trying to delete it owns or administrate the channel

            if (
                !(
                    UlidHelper.IsValid(channelId)
                    && !await context.ChannelMembers.AnyAsync(
                        c => c.ChannelId == channelId && (c.IsOwner || c.IsAdmin),
                        cancellationToken
                    )
                )
            )
            {
                return new NotFoundApiResult();
            }
            else
            {
                hasPermission = true;
            }
        }
        else
        {
            hasPermission = true;
        }

        if (!hasPermission)
        {
            return new ForbiddenApiResult("You do not have permission to delete this message.");
        }

        var deletion = await context
            .Messages.Where(m => m.Id == request.MessageId)
            .ExecuteDeleteAsync(cancellationToken);

        if (deletion <= 0)
        {
            return new NotFoundApiResult();
        }
        await channelsHub
            .Clients.Group(channelId.ToString())
            .SendMessageDeleted(new HubResult<string>(request.MessageId.ToString()));
        return request.MessageId.ToString();
    }
}
