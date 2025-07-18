using System.Data;
using System.Runtime.InteropServices;
using System.Text.Json.Serialization;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Scalar.AspNetCore;
using SerpentineApi.Helpers;

namespace SerpentineApi.Features.ChannelMemberFeatures.Actions;

public class CreateChannelMemberRequest : IRequest<OneOf<ChannelMemberResponse, Failure>>
{
    [Required, JsonPropertyName("channelId"), FromBody]
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
                $"Joins an user to a channel by creating the relation. \n Requires a {nameof(CreateChannelMemberRequest)}. \n Returns a {nameof(ChannelMemberResponse)}. \n Requires Authorization."
            )
            .RequireCors()
            .RequireAuthorization(JwtBearerDefaults.AuthenticationScheme)
            .Experimental()
            .Accepts<CreateChannelMemberRequest>("application/json")
            .WithOpenApi()
            .WithTags(new[] { "POST", $"{nameof(ChannelMember)}" })
            .DisableAntiforgery()
            .Produces<NotFoundApiResult>(404, "application/json")
            .Produces<ConflictApiResult>(409, "application/json")
            .Produces<ServerErrorApiResult>(500, "application/json")
            .Produces<SuccessApiResult<ChannelResponse>>(200, "application/json")
            .Produces<BadRequestApiResult>(400, "application/json");
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
        if (!await context.Channels.AnyAsync(ch => ch.Id == request.ChannelId, cancellationToken))
        {
            return new NotFoundApiResult("The channel do not exist");
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

        ChannelMember creation = ChannelMember.Create(request);

        var role = await context.ChannelMemberRoles.AsNoTracking().FirstOrDefaultAsync(cr => cr.Name == "default", cancellationToken);

        if (role is null)
            return new ServerErrorApiResult("Something went wrong with this request. Try again later");
        
        creation.RoleId = role.Id;
        
        EntityEntry<ChannelMember> response = await context.ChannelMembers.AddAsync(
            creation,
            cancellationToken
        );

        await context.SaveChangesAsync(cancellationToken);
        return response.Entity.ToResponse();
    }
}
