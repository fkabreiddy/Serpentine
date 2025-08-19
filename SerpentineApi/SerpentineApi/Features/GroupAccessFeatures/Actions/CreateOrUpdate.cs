using System.ComponentModel;
using System.Text.Json.Serialization;
        using FluentValidation;
        using Microsoft.AspNetCore.Authentication.JwtBearer;
        using Microsoft.AspNetCore.Mvc;
        using Microsoft.AspNetCore.Mvc.ModelBinding;
        using Microsoft.EntityFrameworkCore;
        using Scalar.AspNetCore;
        using SerpentineApi.DataAccess.Context.EntityExtensions;
        using SerpentineApi.Helpers;
        using SerpentineApi.Identity;
        using SerpentineApi.Services.CloudinaryStorage;
        using SerpentineApi.Helpers;

        namespace SerpentineApi.Features.GroupAccessFeatures.Actions;

        public class CreateGroupAccessRequest : RequestWithUserCredentials,IRequest<OneOf<GroupAccessResponse, Failure>>
        {
            [Required, JsonPropertyName("groupId"), FromBody, Description("The id of the last acceceed group")]
            public Ulid GroupId { get; set; }
        }

        public class CreateGroupAccessRequestValidator : AbstractValidator<CreateGroupAccessRequest>
        {
            public CreateGroupAccessRequestValidator()
            {
                RuleFor(x => x.GroupId)
                    .Must(x => UlidHelper.IsValid(x))
                    .WithMessage("The id of the group must not be empty.");

              
            }
        }

        internal class CreateGroupAccessEndpoint : IEndpoint
        {
            private readonly GroupAccessEndpointSettings _settings = new();
            public void MapEndpoint(IEndpointRouteBuilder app)
            {
                app.MapPut(
                    _settings.BaseUrl,
                    async(
                        [FromBody] CreateGroupAccessRequest command,
                        EndpointExecutor<CreateGroupAccessEndpoint> executor,
                        CancellationToken cancellationToken,
                        ISender sender,
                        HttpContext context
                    ) => await executor.ExecuteAsync<GroupAccessResponse>(async () =>
                    {{
                        command.SetCurrentUserId(UserIdentityRequesterHelper.GetUserIdFromClaims(context.User));
                        command.SetCurrentUserAge(UserIdentityRequesterHelper.GetUserAgeFromClaims(context.User));

                        var result = await sender.SendAndValidateAsync(command, cancellationToken);

                        if (result.IsT1)
                        {
                            var t1 = result.AsT1;

                            return ResultsBuilder.Match(t1);

                        }

                        var t0 = result.AsT0;

                        return ResultsBuilder.Match<GroupAccessResponse>(new SuccessApiResult<GroupAccessResponse>(t0));

                    }})
                )
                .DisableAntiforgery()
                .RequireAuthorization(nameof(AuthorizationPolicies.AllowAllUsers))
                .RequireCors()
                .Experimental()
                .WithOpenApi()
                .WithDescription("Requires Authorization. \n Requires CORS.")
                .WithTags(new string[]{nameof(ApiHttpVerbs.Post), nameof(GroupAccess)})
                .Accepts<CreateGroupAccessRequest>(false, ApiContentTypes.ApplicationJson)
                .Produces<SuccessApiResult<GroupAccessResponse>>(200, ApiContentTypes.ApplicationJson)
                .Produces<BadRequestApiResult>(400, ApiContentTypes.ApplicationJson)
                .Produces<ServerErrorApiResult>(500, ApiContentTypes.ApplicationJson)
                .Produces<ValidationApiResult>(422, ApiContentTypes.ApplicationJson)
                .WithName(nameof(CreateGroupAccessEndpoint));
            }
        }

        internal class CreateGroupAccessEndpointHandler(
            SerpentineDbContext context
        ) : IEndpointHandler<CreateGroupAccessRequest, OneOf<GroupAccessResponse, Failure>>
        {
            public async Task<OneOf<GroupAccessResponse, Failure>> HandleAsync(CreateGroupAccessRequest request, CancellationToken cancellationToken = default)
            {
                var group = await context.Groups.IgnoreAutoIncludes().AsNoTracking()
                    .Where(x => x.Id == request.GroupId).Select(g => new Group()
                    {
                        
                        Id = g.Id,
                        ChannelId = g.ChannelId,
                        Public = g.Public,
                        RequiresOverage = g.RequiresOverage
                        
                    }).FirstOrDefaultAsync(cancellationToken);
                
                if(group is null)
                {
                    return new NotFoundApiResult("Group not found");
                }

                if (await context.ChannelMembers.IgnoreAutoIncludes().AsNoTracking().FirstOrDefaultAsync(x =>
                        x.ChannelId == group.ChannelId && x.UserId == request.CurrentUserId) is var membership && membership is null)
                {
                    return new ForbiddenApiResult("You don't have permission to access this group");
                }


                var isAdminOrOwner = membership.IsOwner || membership.IsAdmin;

                if ((!isAdminOrOwner && !group.Public) || (group.RequiresOverage && (request.CurrentUserAge < 18)))
                {
                    return new ForbiddenApiResult("You don't have permission to register your access in this group");
                }
                
                var existingAccess = await context.GroupAccesses.AsNoTracking().FirstOrDefaultAsync(ga => ga.UserId == request.CurrentUserId && ga.GroupId == request.GroupId, cancellationToken);
                GroupAccess? result;
                
                if (existingAccess is not null)
                {
                    await context.GroupAccesses.Where(ga => ga.Id == existingAccess.Id).ExecuteUpdateAsync(x =>
                        x.SetProperty(y => y.LastAccess, DateTime.UtcNow),
                        cancellationToken
                    );
                    
                    await context.SaveChangesAsync(cancellationToken);
                    
                    result = await context.GroupAccesses.AsNoTracking().FirstOrDefaultAsync(ga => ga.Id == existingAccess.Id, cancellationToken);

                    
                }
                else
                {
                    var creation = GroupAccess.Create(request);

                    await context.GroupAccesses.AddAsync(creation, cancellationToken);
                    await context.SaveChangesAsync(cancellationToken);
                    result = await context.GroupAccesses.AsNoTracking().FirstOrDefaultAsync(ga => ga.Id == creation.Id, cancellationToken);

                    
                }

                if (result is null)
                {
                    return new NotFoundApiResult("Group Access Not Found");
                }
                return result.ToResponse();






            }
        }
        