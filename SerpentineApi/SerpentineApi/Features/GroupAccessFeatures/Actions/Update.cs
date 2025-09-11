using System.Text.Json.Serialization;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using SerpentineApi.DataAccess.Context.EntityExtensions;
using SerpentineApi.Helpers;
using SerpentineApi.Helpers;
using SerpentineApi.Identity;
using SerpentineApi.Services.CloudinaryStorage;

namespace SerpentineApi.Features.GroupAccessFeatures.Actions;

public class UpdateGroupAccessRequest : IRequest<OneOf<GroupAccessResponse, Failure>>
{
    // Aquí va la estructura de tu request
}

public class UpdateGroupAccessRequestValidator : AbstractValidator<UpdateGroupAccessRequest>
{
    public UpdateGroupAccessRequestValidator()
    {
        // Validaciones
    }
}

internal class UpdateGroupAccessEndpoint : IEndpoint
{
    private readonly GroupAccessEndpointSettings _settings = new();

    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut(
                _settings.BaseUrl + "/update",
                async (
                    [FromBody] UpdateGroupAccessRequest command,
                    EndpointExecutor<UpdateGroupAccessEndpoint> executor,
                    CancellationToken cancellationToken,
                    ISender sender,
                    HttpContext context
                ) =>
                    await executor.ExecuteAsync<GroupAccessResponse>(async () =>
                    {
                        {
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

                            return ResultsBuilder.Match<GroupAccessResponse>(
                                new SuccessApiResult<GroupAccessResponse>(t0)
                            );
                        }
                    })
            )
            .DisableAntiforgery()
            .RequireAuthorization(nameof(AuthorizationPolicies.AllowAllUsers))
            .RequireCors()
            .Experimental()
            .WithOpenApi()
            .WithDescription("Requires Authorization. \n Requires CORS.")
            .WithTags(new string[] { nameof(ApiHttpVerbs.Put), nameof(GroupAccess) })
            .Accepts<UpdateGroupAccessRequest>(false, ApiContentTypes.ApplicationJson)
            .Produces<SuccessApiResult<GroupAccessResponse>>(200, ApiContentTypes.ApplicationJson)
            .Produces<BadRequestApiResult>(400, ApiContentTypes.ApplicationJson)
            .Produces<ServerErrorApiResult>(500, ApiContentTypes.ApplicationJson)
            .Produces<ValidationApiResult>(422, ApiContentTypes.ApplicationJson)
            .WithName(nameof(UpdateGroupAccessEndpoint));
    }
}

internal class UpdateGroupAccessEndpointHandler
    : IEndpointHandler<UpdateGroupAccessRequest, OneOf<GroupAccessResponse, Failure>>
{
    public async Task<OneOf<GroupAccessResponse, Failure>> HandleAsync(
        UpdateGroupAccessRequest request,
        CancellationToken cancellationToken = default
    )
    {
        return new NotFoundApiResult();
    }
}
