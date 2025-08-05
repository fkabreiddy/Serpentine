using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using SerpentineApi.DataAccess.Context.EntityExtensions;

namespace SerpentineApi.Features.ChannelFeatures.Queries;

using System.Text.Json.Serialization;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Scalar.AspNetCore;
using SerpentineApi.Helpers;

public class GetByUserIdRequest : IRequest<OneOf<List<ChannelResponse>, Failure>>
{
    [BindNever, JsonIgnore]
    public Ulid CurrentUserId { get; private set; }

    [Required, FromQuery(Name = "take"), JsonPropertyName("take"), Range(1, 5)]
    public int Take { get; set; } = 0;

    [Required, FromQuery(Name = "skip"), JsonPropertyName("skip"), Range(0, int.MaxValue)]
    public int Skip { get; set; } = 0;

    public void SetCurentUerId(Ulid userId)
    {
        CurrentUserId = userId;
    }
}

public class GetByUserIdValidator : AbstractValidator<GetByUserIdRequest>
{
    public GetByUserIdValidator()
    {
        RuleFor(x => x.Take).InclusiveBetween(1, 5).WithMessage("Take should be between 1 and 5");

        RuleFor(x => x.Skip)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Skip should be greater or equal to 0.");
    }
}

internal class GetByUserIdEndpoint : IEndpoint
{
    private readonly ChannelEndpointSettings _settings = new();

    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(
                _settings.BaseUrl,
                async (
                    [AsParameters] GetByUserIdRequest command,
                    EndpointExecutor<GetByUserIdEndpoint> executor,
                    CancellationToken cancellationToken,
                    ISender sender,
                    HttpContext context
                ) =>
                {
                    return await executor.ExecuteAsync<List<ChannelResponse>>(async () =>
                    {
                        command.SetCurentUerId(
                            UserIdentityRequesterHelper.GetUserIdFromClaims(context.User)
                        );
                        var result = await sender.SendAndValidateAsync(command, cancellationToken);
                        if (result.IsT1)
                        {
                            var error = result.AsT1;

                            return ResultsBuilder.Match<UserResponse>(error);
                        }

                        var channels = result.AsT0;
                        return Results.Ok(new SuccessApiResult<List<ChannelResponse>>(channels));
                    });
                }
            )
            .DisableAntiforgery()
            .RequireAuthorization(JwtBearerDefaults.AuthenticationScheme)
            .Experimental()
            .WithOpenApi()
            .WithTags(new[] { nameof(ApiHttpVerbs.Get), nameof(Channel) })
            .RequireCors()
            .Accepts<GetByUserIdRequest>(false, ApiContentTypes.ApplicationJson)
            .Produces<SuccessApiResult<List<ChannelResponse>>>(200)
            .Produces<BadRequestApiResult>(400, ApiContentTypes.ApplicationJson)
            .Produces<ServerErrorApiResult>(500, ApiContentTypes.ApplicationJson)
            .Produces<ValidationApiResult>(422, ApiContentTypes.ApplicationJson)
            .WithDescription(
                $"Return a list of channels. Requires Authorization. Requires CORS"
            )
            .WithName(nameof(GetByUserIdEndpoint));
    }
}

internal class GetByUserIdEndpointHandler(SerpentineDbContext context)
    : IEndpointHandler<GetByUserIdRequest, OneOf<List<ChannelResponse>, Failure>>
{
    public async Task<OneOf<List<ChannelResponse>, Failure>> HandleAsync(
        GetByUserIdRequest request,
        CancellationToken cancellationToken = default
    )
    {
        if (string.IsNullOrEmpty(request.CurrentUserId.ToString()))
            return new BadRequestApiResult("UserId should be greater than 0");

        List<Channel> channels = await context.Channels.GetChannelsWithJustMyMembershipByUserId(
            request.CurrentUserId,
            cancellationToken,
            request.Skip,
            request.Take
        );

       foreach(var channel in channels){
        
            channel.UnreadMessages = await context.GroupAccesses.GetMessagesCountByChannelId(
                channel.Id,
                request.CurrentUserId,
                cancellationToken
            );
       }


        var response = channels.Select(ch => ch.ToResponse()).ToList();
        return response;
    }
}
