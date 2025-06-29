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

        namespace SerpentineApi.Features.ChannelMemberFeatures.Actions;

        public class DeleteChannelMemberRequest : IRequest<OneOf<ChannelMemberResponse, Failure>>
        {
            // Aquí va la estructura de tu request
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
                    _settings.BaseUrl + "/delete",
                    async(
                        [AsParameters] DeleteChannelMemberRequest command,
                        EndpointExecutor<DeleteChannelMemberEndpoint> executor,
                        CancellationToken cancellationToken,
                        ISender sender,
                        HttpContext context
                    ) => await executor.ExecuteAsync<ChannelMemberResponse>(async () =>
                    {
                        return ResultsBuilder.Match(new NotFoundApiResult());

                    })
                )
                .DisableAntiforgery()
                .RequireAuthorization(JwtBearerDefaults.AuthenticationScheme)
                .RequireCors()
                .Experimental()
                .WithOpenApi()
                .Accepts<DeleteChannelMemberRequest>(false, "multipart/form-data")
                .Produces<SuccessApiResult<ChannelMemberResponse>>(200)
                .Produces<BadRequestApiResult>(400, "application/json")
                .Produces<ServerErrorApiResult>(500, "application/json")
                .Produces<ValidationApiResult>(422, "application/json")
                .WithName(nameof(DeleteChannelMemberEndpoint));
            }
        }

        internal class DeleteChannelMemberEndpointHandler : IEndpointHandler<DeleteChannelMemberRequest, OneOf<ChannelMemberResponse, Failure>>
        {
            public async Task<OneOf<ChannelMemberResponse, Failure>> HandleAsync(DeleteChannelMemberRequest request, CancellationToken cancellationToken = default)
            {
                return new NotFoundApiResult();
            }
        }
        