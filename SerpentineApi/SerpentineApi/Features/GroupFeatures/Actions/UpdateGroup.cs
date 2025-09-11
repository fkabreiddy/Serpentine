using System.ComponentModel;
using System.Text.Json.Serialization;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using SerpentineApi.DataAccess.Context.EntityExtensions;
using SerpentineApi.Helpers;

namespace SerpentineApi.Features.GroupFeatures.Actions;

public class UpdateGroupRequest
    : RequestWithUserCredentials,
        IRequest<OneOf<GroupResponse, Failure>>
{
    [FromBody, Required, JsonPropertyName("groupId"), Description("The id of the group to update")]
    public Ulid GroupId { get; set; }

    [
        FromBody,
        Required,
        MaxLength(100),
        MinLength(3),
        RegularExpression(@"^[a-zA-Z0-9_]+$"),
        JsonPropertyName("name"),
        Description("The name of the group")
    ]
    public required string Name { get; set; }

    [
        FromBody,
        Required,
        JsonPropertyName("public"),
        Description("Whether a group is public or not")
    ]
    public bool Public { get; set; }

    [
        FromBody,
        Required,
        JsonPropertyName("requiresOverage"),
        Description("Whether a group requires the member of the channel to be overage or not")
    ]
    public bool RequiresOverage { get; set; }
}

public class UpdateGroupRequestValidator : AbstractValidator<UpdateGroupRequest>
{
    public UpdateGroupRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotNull()
            .NotEmpty()
            .WithMessage("Name cannot be empty.")
            .MinimumLength(3)
            .WithMessage("Name must be at least 3 characters.")
            .MaximumLength(100)
            .WithMessage("Name cannot exceed 100 characters.")
            .Matches(@"^[a-zA-Z0-9_]+$")
            .WithMessage("Name can only contain letters, numbers, and underscores.");

        RuleFor(x => x.Public).NotNull().WithMessage("Especify if the group is public or not");
        RuleFor(x => x.RequiresOverage)
            .NotNull()
            .WithMessage("Especify if the group requires overage or not");
    }

    internal class UpdateGroupEndpoint : IEndpoint
    {
        private readonly GroupEndpointSettings _settings = new();

        public void MapEndpoint(IEndpointRouteBuilder app)
        {
            app.MapPut(
                    _settings.BaseUrl,
                    async (
                        [FromBody] UpdateGroupRequest command,
                        EndpointExecutor<UpdateGroupEndpoint> executor,
                        CancellationToken cancellationToken,
                        ISender sender,
                        HttpContext context
                    ) =>
                        await executor.ExecuteAsync<GroupResponse>(async () =>
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

                            return ResultsBuilder.Match<GroupResponse>(
                                new SuccessApiResult<GroupResponse>(t0)
                            );
                        })
                )
                .DisableAntiforgery()
                .RequireAuthorization(nameof(AuthorizationPolicies.AllowAllUsers))
                .RequireCors()
                .Experimental()
                .WithOpenApi()
                .WithDescription(
                    "Updates a group with a certain id. Requires Authorization. \n Requires CORS."
                )
                .WithTags(new string[] { nameof(ApiHttpVerbs.Put), nameof(Group) })
                .Accepts<UpdateGroupRequest>(false, ApiContentTypes.ApplicationJson)
                .Produces<SuccessApiResult<GroupResponse>>(200, ApiContentTypes.ApplicationJson)
                .Produces<BadRequestApiResult>(400, ApiContentTypes.ApplicationJson)
                .Produces<ServerErrorApiResult>(500, ApiContentTypes.ApplicationJson)
                .Produces<ValidationApiResult>(422, ApiContentTypes.ApplicationJson)
                .Produces<NotFoundApiResult>(404, ApiContentTypes.ApplicationJson)
                .Produces<ForbiddenApiResult>(403, ApiContentTypes.ApplicationJson)
                .Produces<ConflictApiResult>(409, ApiContentTypes.ApplicationJson)
                .WithName(nameof(UpdateGroupEndpoint));
        }
    }

    internal class UpdateGroupEndpointHandler(SerpentineDbContext context)
        : IEndpointHandler<UpdateGroupRequest, OneOf<GroupResponse, Failure>>
    {
        public async Task<OneOf<GroupResponse, Failure>> HandleAsync(
            UpdateGroupRequest request,
            CancellationToken cancellationToken = default
        )
        {
            request.Name.Trim();

            if (
                await context
                    .Groups.AsTracking()
                    .AsSplitQuery()
                    .FirstOrDefaultAsync(g => g.Id == request.GroupId, cancellationToken)
                    is var group
                && group is null
            )
            {
                return new NotFoundApiResult("Group not found");
            }

            if (
                await context.Groups.AnyAsync(x =>
                    x.ChannelId == group.ChannelId
                    && x.Name.ToLower() == request.Name.ToLower()
                    && x.Id != group.Id
                )
            )
                return new ConflictApiResult(
                    "Another group on this channel with the same name already exist"
                );

            if (
                await context
                    .ChannelMembers.AsNoTracking()
                    .AsSplitQuery()
                    .FirstOrDefaultAsync(
                        cm => cm.ChannelId == group.ChannelId && cm.UserId == request.CurrentUserId,
                        cancellationToken
                    )
                    is var membership
                && membership is null
            )
            {
                return new NotFoundApiResult("Seems you dont belong to this channel");
            }

            if (!membership.IsOwner && !membership.IsAdmin)
            {
                return new ForbiddenApiResult("You don't have permission to update this group");
            }

            if (group.Update(request))
            {
                await context.SaveChangesAsync(cancellationToken);
            }

            if (
                await context.Groups.GetGroupWithJustMyAccessByGroupId(
                    request.GroupId,
                    request.CurrentUserId
                )
                    is var result
                && result is null
            )
            {
                return new NotFoundApiResult("Group not found");
            }

            result.UnreadMessages = await context.Messages.CountUnreadMessagesFromAGroup(
                result.Id,
                request.CurrentUserId,
                result.MyAccess?.LastReadMessageDate ?? result.CreatedAt,
                cancellationToken
            );

            return result.ToResponse();
        }
    }
}
