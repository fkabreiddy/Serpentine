using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;

namespace SerpentineApi.Features.ChannelFeatures.Queries;
using System.Text.Json.Serialization;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Scalar.AspNetCore;
using SerpentineApi.Helpers;




public class GetByUserIdRequest : IRequest<OneOf<List<ChannelResponse>, Failure>>
{

    [Required, 
    FromQuery(Name = "userId"),
    JsonPropertyName("userId"),
    Range(1, int.MaxValue)]
    public int UserId { get; set; } = 0;
    
    [Required, 
     FromQuery(Name = "take"),
     JsonPropertyName("take"),
     Range(1, 5)]
    public int Take { get; set; } = 0;
    
    [Required, 
     FromQuery(Name = "skip"),
     JsonPropertyName("skip"),
     Range(0, int.MaxValue )]
    public int Skip { get; set; } = 0;

  
}

public class GetByUserIdValidator : AbstractValidator<GetByUserIdRequest>
{
    public GetByUserIdValidator()
    {
        RuleFor(x => x.UserId)
            .GreaterThanOrEqualTo(1)
            .WithMessage("UserId should be greater or equal to 1.");

        RuleFor(x => x.Take)
            .InclusiveBetween(1, 5)
            .WithMessage("Take should be between 1 and 5");

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
                _settings.BaseUrl + "/by-userId",
                async (
                    [AsParameters] GetByUserIdRequest command,
                    EndpointExecutor<GetByUserIdEndpoint> executor,
                     CancellationToken cancellationToken,
                     ISender sender
                ) =>
                {
                    return await executor.ExecuteAsync<List<ChannelResponse>>(async () =>
                    {
                        

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
        .RequireCors()
        .Accepts<GetByUserIdRequest>(false, "application/json")
        .Produces<SuccessApiResult<List<ChannelResponse>>>(200)
        .Produces<BadRequestApiResult>(400, "application/json")
        .Produces<ServerErrorApiResult>(500, "application/json")
        .Produces<ValidationApiResult>(422, "application/json")
        .WithDescription($"Return a list of {nameof(ChannelResponse)} where the user is member of. Requires {nameof(GetByUserIdRequest)}. Returns a list of {nameof(ChannelResponse)}")
        .WithName(nameof(GetByUserIdEndpoint));
    }

  


}

internal class GetByUserIdEndpointHandler(
    SerpentineDbContext context

    )
    : IEndpointHandler<GetByUserIdRequest, OneOf<List<ChannelResponse>, Failure>>
{
    public async Task<OneOf<List<ChannelResponse>, Failure>> HandleAsync(
        GetByUserIdRequest request,
        CancellationToken cancellationToken = default
    )
    {
        if (request.UserId == default)
            return new BadRequestApiResult("UserId should be greater than 0");

        var channels = await context.Channels
            .Include(ch => ch.Members.Where(m => m.UserId == request.UserId))
            .AsNoTracking()
            .AsSplitQuery()
            .Where(ch => ch.Members.Any(m => m.UserId == request.UserId))
            .OrderBy(ch => ch.Id)
            .Skip(request.Skip)
            .Take(request.Take)
            .Select(ch => new Channel()
            {
                Name = ch.Name,
                Id =  ch.Id,
                CreatedAt = ch.CreatedAt,
                UpdatedAt = ch.UpdatedAt,
                AdultContent = ch.AdultContent,
                Description = ch.Description,
                MembersCount = ch.Members.Count,
                Members = ch.Members
              
            })
            .ToListAsync(cancellationToken);


        return channels.Select(ch => ch.ToResponse(request.UserId)).ToList();
    }

  
}
