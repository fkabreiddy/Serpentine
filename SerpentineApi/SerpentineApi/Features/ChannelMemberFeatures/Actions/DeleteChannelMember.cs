using System.Diagnostics;
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

namespace SerpentineApi.Features.ChannelMemberFeatures.Actions;

public class DeleteChannelMemberRequest : IRequest<OneOf<ChannelMemberResponse, Failure>>
{
    [Required]
    public string TypeOfResponse { get; set; }
}

public class DeleteChannelMemberRequestValidator : AbstractValidator<DeleteChannelMemberRequest>
{
    public DeleteChannelMemberRequestValidator()
    {
        // Validaciones
    }
}

internal class DeleteChannelMemberEndpoint : IEndpoint
{
    private readonly ChannelMemberEndpointSettings _settings = new();

    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete(
                _settings.BaseUrl + "/test",
                async(
                    [AsParameters] DeleteChannelMemberRequest command,
                    EndpointExecutor < DeleteChannelMemberEndpoint > executor,
                    CancellationToken cancellationToken,
                    ILogger<DeleteChannelMemberEndpoint> logger,
                    ISender sender,
                    HttpContext context
                ) =>
                    await executor.ExecuteAsync<string>(async () =>
                    {
                        await Task.CompletedTask;
                        IApiResult result;
                        switch (command.TypeOfResponse)
                        {
                            case "ok":
                                result = new SuccessApiResult<string>("Ok");
                                break;

                            case "not found":
                                result = new NotFoundApiResult();
                                break;

                            case "bad request":
                                result = new BadRequestApiResult();
                                break;

                            case "conflict":
                                result = new ConflictApiResult();
                                break;

                            case "validation":
                                result = new ValidationApiResult();
                                break;

                            default:
                                result = new BadRequestApiResult();
                                break;                        }
                        logger.LogError($"Fetch to {typeof(DeleteChannelMemberEndpoint).Name } endpoint failed. Reason: " + result.Message);
                        return ResultsBuilder.Match<string>(result);
                    })
            )
            .DisableAntiforgery()
            .RequireAuthorization(JwtBearerDefaults.AuthenticationScheme)
            .RequireCors()
            .Experimental()
            .WithOpenApi()
            .Accepts<DeleteChannelMemberRequest>(false, "application/json")
            .Produces<SuccessApiResult<ChannelMemberResponse>>(200)
            .Produces<BadRequestApiResult>(400, "application/json")
            .Produces<ServerErrorApiResult>(500, "application/json")
            .Produces<ValidationApiResult>(422, "application/json")
            .WithName(nameof(DeleteChannelMemberEndpoint));
    }
}

internal class DeleteChannelMemberEndpointHandler
    : IEndpointHandler<DeleteChannelMemberRequest, OneOf<ChannelMemberResponse, Failure>>
{
    public async Task<OneOf<ChannelMemberResponse, Failure>> HandleAsync(
        DeleteChannelMemberRequest request,
        CancellationToken cancellationToken = default
    )
    {
        await Task.CompletedTask;
        return new NotFoundApiResult();
    }
}
