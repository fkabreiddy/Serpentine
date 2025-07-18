using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using SerpentineApi.DataAccess.Context.EntityExtensions;
using SerpentineApi.Helpers;

namespace SerpentineApi.Features.GroupFeatures.Actions;

public class CreateGroupRequest : IRequest<OneOf<GroupResponse, Failure>>
{
    [
        Required,
        MaxLength(100),
        MinLength(3),
        RegularExpression(@"^[a-zA-Z0-9_]+$"),
        JsonPropertyName("name"),
        FromBody
    ]
    public string Name { get; set; } = null!;
    
    [
        Required,
        MaxLength(1000),
        MinLength(3),
        JsonPropertyName("rules"),
        FromBody
    ]
    public string Rules { get; set; } = null!;
    
    [JsonPropertyName("public"), Required, FromBody]
    public bool Public { get; set; } = true;

    [Required, JsonPropertyName("channelId"), FromBody]
    public Ulid ChannelId { get; set; }

    [NotMapped, JsonIgnore]
    public Ulid CurrentUserId { get; private set; }

    public void SetCurrentUserId(Ulid userId)
    {
        CurrentUserId = userId;
    }
}

public class CreateGroupRequestValidator : AbstractValidator<CreateGroupRequest>
{
    public CreateGroupRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotNull()
            .NotEmpty()
            .MinimumLength(3)
            .WithMessage("Group name should be more than 3 characters long")
            .MaximumLength(100)
            .WithMessage("Group name should be less than 100 characters long")
            .Matches(@"^[a-zA-Z0-9_]+$")
            .WithMessage("Only letters, numbers and underscores are allowed");

        RuleFor(x => x.ChannelId)
            .Must(x => UlidHelper.IsValid(x))
            .WithMessage("Channel Id should be an valid Ulid.");
    }
}

internal class CreateGroupEndpoint : IEndpoint
{
    private readonly GroupEndpointSettings _settings = new();

    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(
                _settings.BaseUrl + "/create",
                async (
                    [FromBody] CreateGroupRequest command,
                    EndpointExecutor<CreateGroupEndpoint> executor,
                    CancellationToken cancellationToken,
                    ISender sender,
                    HttpContext context
                ) =>
                {
                    return await executor.ExecuteAsync<GroupResponse>(async () =>
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

                        return ResultsBuilder.Match<GroupResponse>(
                            new SuccessApiResult<GroupResponse>(t0)
                        );
                    });
                }
            )
            .DisableAntiforgery()
            .RequireAuthorization(JwtBearerDefaults.AuthenticationScheme)
            .RequireCors()
            .Experimental()
            .WithOpenApi()
            .WithTags(new[] { "Groups", "POST" })
            .WithDescription(
                $"Creates a group. Returns a {nameof(GroupResponse)}. Accepts a {nameof(CreateGroupRequest)}. Requires authorization"
            )
            .Accepts<CreateGroupRequest>(false, "application/json")
            .Produces<SuccessApiResult<GroupResponse>>(200)
            .Produces<BadRequestApiResult>(400, "application/json")
            .Produces<ServerErrorApiResult>(500, "application/json")
            .Produces<ValidationApiResult>(422, "application/json")
            .Produces<ConflictApiResult>(409, "application/json")
            .WithName(nameof(CreateGroupEndpoint));
    }
}

internal class CreateGroupEndpointHandler(SerpentineDbContext dbContext)
    : IEndpointHandler<CreateGroupRequest, OneOf<GroupResponse, Failure>>
{
    public async Task<OneOf<GroupResponse, Failure>> HandleAsync(
        CreateGroupRequest request,
        CancellationToken cancellationToken = default
    )
    {
        using var transaction = await dbContext.Database.BeginTransactionAsync(cancellationToken);

        try
        {
            if (!await dbContext.Channels.AnyAsync(ch => ch.Id == request.ChannelId))
                return new BadRequestApiResult("Channel do not exist");

            if (
                await dbContext.Groups.AnyAsync(x =>
                    x.ChannelId == request.ChannelId && x.Name.ToLower() == request.Name.ToLower()
                )
            )
                return new ConflictApiResult(
                    "Another group on this channel with the same name already exist"
                );

            var newGroup = Group.Create(request);

            var insertion = await dbContext.Groups.AddAsync(newGroup, cancellationToken);
            await dbContext.SaveChangesAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);
            var insertionId = insertion.Entity.Id;
            dbContext.ChangeTracker.Clear();
            var group = await dbContext.Groups.GetGroupWithJustMyAccessByGroupId(
                insertionId,
                request.CurrentUserId,
                cancellationToken
            );

            if (group is null)
            {
                await transaction.RollbackAsync(cancellationToken);
                return new BadRequestApiResult("Group not found");
            }

            if (group.MyAccess is not null)
                group.UnreadMessages = await dbContext.Messages.CountUnreadMessagesFromAGroup(
                    group.Id,
                    request.CurrentUserId,
                    group.MyAccess.LastAccess,
                    cancellationToken
                );

            return group.ToResponse();
        }
        catch (Exception)
        {
            await transaction.RollbackAsync(cancellationToken);
            throw;
        }
    }
}
