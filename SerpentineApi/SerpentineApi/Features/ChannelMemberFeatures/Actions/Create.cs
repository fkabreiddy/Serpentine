using System.ComponentModel;
using System.Text.Json.Serialization;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using SerpentineApi.Helpers;

namespace SerpentineApi.Features.ChannelMemberFeatures.Actions;

public class CreateChannelMemberRequest : IRequest<OneOf<ChannelMemberResponse, Failure>>
{
    [Required, JsonPropertyName("channelId"), FromBody, Description("The id of the channel that user is joining")]
    public Ulid ChannelId { get; set; }

    [JsonIgnore, BindNever]
    public Ulid CurrentUserId { get; private set; }

    public void SetCurrentUserId(Ulid currentUserId)
    {
        CurrentUserId = currentUserId;
    }
}

public class CreateChannelMemberRequestValidator : AbstractValidator<CreateChannelMemberRequest>
{
    public CreateChannelMemberRequestValidator()
    {
        RuleFor(x => x.ChannelId)
            .Must(x => UlidHelper.IsValid(x))
            .WithMessage("The id of the channel must not be empty.");
    }
}

public class CreateChannelMemberEndpoint : IEndpoint
{
    private readonly ChannelMemberEndpointSettings _settings = new();

    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(
                _settings.BaseUrl + "/create",
                async (
                    [FromBody] CreateChannelMemberRequest request,
                    HttpContext context,
                    CancellationToken token,
                    ISender sender,
                    EndpointExecutor<CreateChannelMemberEndpoint> endpointExecutor
                ) =>
                {
                    return await endpointExecutor.ExecuteAsync<ChannelResponse>(async () =>
                    {
                        request.SetCurrentUserId(
                            UserIdentityRequesterHelper.GetUserIdFromClaims(context.User)
                        );

                        var result = await sender.SendAndValidateAsync(request, token);

                        if (result.IsT1)
                        {
                            var failure = result.AsT1;

                            return ResultsBuilder.Match(failure);
                        }

                        var success = result.AsT0;

                        return ResultsBuilder.Match<ChannelMemberResponse>(
                            new SuccessApiResult<ChannelMemberResponse>(success)
                        );
                    });
                }
            )
            .WithName(nameof(CreateChannelMemberEndpoint))
            .WithDescription(
                $"Joins an user to a channel by creating the relation. \n Requires Authorization. \n Requires CORS"
            )
            .RequireCors()
            .RequireAuthorization(nameof(AuthorizationPolicies.AllowAllUsers))
            .Stable()
            .Accepts<CreateChannelMemberRequest>("application/json")
            .WithOpenApi()
            .WithTags(new[] { nameof(ApiHttpVerbs.Post), nameof(ChannelMember) })
            .DisableAntiforgery()
            .Produces<NotFoundApiResult>(404, ApiContentTypes.ApplicationJson)
            .Produces<ConflictApiResult>(409, ApiContentTypes.ApplicationJson)
            .Produces<ServerErrorApiResult>(500, ApiContentTypes.ApplicationJson)
            .Produces<SuccessApiResult<ChannelResponse>>(200, ApiContentTypes.ApplicationJson)
            .Produces<ForbiddenApiResult>(403, ApiContentTypes.ApplicationJson)
            .Produces<BadRequestApiResult>(400, ApiContentTypes.ApplicationJson);
    }
}

internal class CreateChannelMemberEndpointHandler(SerpentineDbContext context)
    : IEndpointHandler<CreateChannelMemberRequest, OneOf<ChannelMemberResponse, Failure>>
{
    public async Task<OneOf<ChannelMemberResponse, Failure>> HandleAsync(
        CreateChannelMemberRequest request,
        CancellationToken cancellationToken
    )
    {
        if (await context.ChannelBans.FirstOrDefaultAsync(x =>
                x.ChannelId == request.ChannelId && x.UserId == request.CurrentUserId, cancellationToken) is var ban && ban is not null)
            return new BadRequestApiResult($"You have been banned from this channel. For {ban.Reason}");
        
        if (await context.Channels.FirstOrDefaultAsync(ch => ch.Id == request.ChannelId, cancellationToken) is var channel && channel is null)
        {
            return new NotFoundApiResult("The channel do not exist");
        }

        if (await context.Users.FirstOrDefaultAsync(u => u.Id == request.CurrentUserId) is var user && user is null)
        {
            return new NotFoundApiResult("We couldn't find your account");
        }

        if (channel.AdultContent && user.GetAge(user.DayOfBirth) < 18)
        {
            return new ForbiddenApiResult("This channel contains adult content. You cannot access to this channel if you are not overage.");
        }

        

        if (
                await context.ChannelMembers.AnyAsync(
                        cm => cm.UserId == request.CurrentUserId && cm.ChannelId == request.ChannelId,
                        cancellationToken
                    )
                )
            {
                return new ConflictApiResult("You already belong to this channel");
            }

        using var transaction = await context.Database.BeginTransactionAsync();

        try
        {

            ChannelMember creation = ChannelMember.Create(request);

          

            await context.ChannelMembers.AddAsync(
                creation,
                cancellationToken
            );



            await context.SaveChangesAsync(cancellationToken);

            context.ChangeTracker.Clear();

            var result = await context.ChannelMembers.AsSplitQuery().AsNoTracking().FirstOrDefaultAsync(cm => cm.UserId == request.CurrentUserId && cm.ChannelId == request.ChannelId, cancellationToken);

            if (result is null)
            {
                await transaction.RollbackAsync();
                return new ServerErrorApiResult("Could not create the memebership. Try again later");
            }

            await transaction.CommitAsync(cancellationToken);

            return result.ToResponse();


        }
        catch (Exception)
        {
            await transaction.RollbackAsync(cancellationToken);
            throw;
        }
        
    }
}

