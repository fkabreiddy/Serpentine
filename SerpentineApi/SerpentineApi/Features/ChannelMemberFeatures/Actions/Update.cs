using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Text.Json.Serialization;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using SerpentineApi.Helpers;

namespace SerpentineApi.Features.ChannelMemberFeatures.Actions;

public class UpdateChannelMemberRequest
    : RequestWithUserCredentials,
        IRequest<OneOf<ChannelMemberResponse, Failure>>
{
    [
        JsonPropertyName("channelMemberId"),
        Required,
        FromBody,
        Description("The id of the channelId to update")
    ]
    public Ulid ChannelMemberId { get; set; }

    [
        JsonPropertyName("shouldBeAdmin"),
        FromBody,
        Description(
            "Stablish wether Admin role should be updated. If null, no changes will be applied."
        )
    ]
    public bool? ShouldBeAdmin { get; set; } = null;
}

public class UpdateChannelMemberRequestValidator : AbstractValidator<UpdateChannelMemberRequest>
{
    public UpdateChannelMemberRequestValidator()
    {
        RuleFor(x => x.ChannelMemberId)
            .Must(x => UlidHelper.IsValid(x))
            .WithMessage("The id of the ChannelMember must not be empty.");
    }
}

internal class UpdateChannelMemberEndpoint : IEndpoint
{
    private readonly ChannelMemberEndpointSettings _settings = new();

    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPatch(
                _settings.BaseUrl,
                async (
                    [FromBody] UpdateChannelMemberRequest command,
                    EndpointExecutor<UpdateChannelMemberEndpoint> executor,
                    CancellationToken cancellationToken,
                    ISender sender,
                    HttpContext context
                ) =>
                    await executor.ExecuteAsync<ChannelMemberResponse>(async () =>
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

                            return ResultsBuilder.Match<ChannelMemberResponse>(
                                new SuccessApiResult<ChannelMemberResponse>(t0)
                            );
                        }
                    })
            )
            .DisableAntiforgery()
            .RequireAuthorization(JwtBearerDefaults.AuthenticationScheme)
            .RequireCors()
            .Stable()
            .WithTags(new[] { nameof(ApiHttpVerbs.Patch), nameof(ChannelMember) })
            .WithOpenApi()
            .Accepts<UpdateChannelMemberRequest>(false, ApiContentTypes.ApplicationJson)
            .Produces<SuccessApiResult<ChannelMemberResponse>>(200, ApiContentTypes.ApplicationJson)
            .Produces<BadRequestApiResult>(400, ApiContentTypes.ApplicationJson)
            .Produces<ServerErrorApiResult>(500, ApiContentTypes.ApplicationJson)
            .Produces<ValidationApiResult>(422, ApiContentTypes.ApplicationJson)
            .Produces<NotFoundApiResult>(404, ApiContentTypes.ApplicationJson)
            .WithName(nameof(UpdateChannelMemberEndpoint))
            .WithDescription(
                "Updated a the data of the Member from a Channel. \n Requires Authorization. \n Requires CORS."
            );
    }
}

internal class UpdateChannelMemberEndpointHandler(SerpentineDbContext context)
    : IEndpointHandler<UpdateChannelMemberRequest, OneOf<ChannelMemberResponse, Failure>>
{
    public async Task<OneOf<ChannelMemberResponse, Failure>> HandleAsync(
        UpdateChannelMemberRequest request,
        CancellationToken cancellationToken = default
    )
    {
        var channelMember = await context.ChannelMembers.FirstOrDefaultAsync(
            cm => cm.Id == request.ChannelMemberId,
            cancellationToken
        );

        if (channelMember is null)
            return new NotFoundApiResult("Membership not found");

        if (
            !await context.ChannelMembers.AnyAsync(
                cm =>
                    cm.ChannelId == channelMember.ChannelId
                    && cm.UserId == request.CurrentUserId
                    && cm.IsOwner,
                cancellationToken
            )
        )
        {
            return new ForbiddenApiResult("You are not authorized to update a member's role.");
        }

        if (request.ShouldBeAdmin.HasValue)
        {
            channelMember.IsAdmin = request.ShouldBeAdmin.Value;
        }

        await context.SaveChangesAsync(cancellationToken);
        context.ChangeTracker.Clear();

        var result = await context
            .ChannelMembers.AsNoTracking()
            .FirstOrDefaultAsync(cm => cm.Id == channelMember.Id, cancellationToken);

        if (result is null)
            return new NotFoundApiResult("Membership not found");

        return result.ToResponse();
    }
}
